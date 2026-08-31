package br.com.kaio.catesys.bss;

import java.time.LocalDate;
import java.util.List;

import br.com.kaio.catesys.domain.Aluno;
import br.com.kaio.catesys.domain.Aula;
import br.com.kaio.catesys.domain.Presenca;
import br.com.kaio.catesys.domain.PresencaId;
import br.com.kaio.catesys.domain.Turma;
import br.com.kaio.catesys.eps.dto.AlunoPresencaDTO;
import br.com.kaio.catesys.eps.dto.AulaDTO;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;

@Stateless
public class AulaBss {

	@PersistenceContext(unitName = "MeuPu")
	private EntityManager em;

	public List<Aula> getListAula() {

		try {
			String jpql = "select obj from Aula obj";
			TypedQuery<Aula> query = em.createQuery(jpql, Aula.class);
			return query.getResultList();
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Erro ao listar", e);
		}
	}

	public List<Aula> getTA() {
		try {
			String jpql = "	SELECT p FROM Aula p";
			TypedQuery<Aula> query = em.createQuery(jpql, Aula.class);

			return query.getResultList();
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Erro ao listar", e);
		}
	}

	public List<Object[]> getTurmaAluno(Integer codigo) {

		try {
			String jpql = """
					SELECT a.matricula, a.nome, a.status
					 FROM TurmaAluno ta
					 LEFT JOIN Aluno a
					     ON a.matricula = ta.id.alunoMatricula
					 WHERE :codigo IS NULL
					    OR ta.id.turmaCodigo = :codigo
					 """;

			TypedQuery<Object[]> query = em.createQuery(jpql, Object[].class);

			query.setParameter("codigo", codigo);

			return query.getResultList();

		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Erro ao listar", e);
		}
	}

	public List<Aula> getList(String codigo, String data, String turmaCodigo) {

		try {

			String jpql = """
					SELECT a
					FROM Aula a
					WHERE (:codigo IS NULL OR a.codigo = :codigo)
					  AND (:data IS NULL OR a.data = :data)
					  AND (:turmaCodigo IS NULL OR a.turmaCodigo = :turmaCodigo)
					""";

			TypedQuery<Aula> query = em.createQuery(jpql, Aula.class);

			Integer codigoInt = (codigo == null || codigo.equals("null") || codigo.isBlank()) ? null
					: Integer.valueOf(codigo);

			LocalDate dataParsed = (data == null || data.equals("null") || data.isBlank()) ? null
					: LocalDate.parse(data);

			Integer turmaCodigoInt = (turmaCodigo == null || turmaCodigo.equals("null") || turmaCodigo.isBlank()) ? null
					: Integer.valueOf(turmaCodigo);

			query.setParameter("data", dataParsed);
			query.setParameter("codigo", codigoInt);
			query.setParameter("turmaCodigo", turmaCodigoInt);

			return query.getResultList();

		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Erro ao listar aulas", e);
		}
	}

	public AulaDTO getEntity(Integer codigoTurma) {
		try {

			// Busca a turma
			Turma turma = em.createQuery("SELECT t FROM Turma t WHERE t.codigo = :codigo", Turma.class)
					.setParameter("codigo", codigoTurma).getSingleResult();

			// Busca a última aula da turma
			Aula aula = em.createQuery("""
					SELECT a
					FROM Aula a
					WHERE a.turmaCodigo = :codigoTurma
					ORDER BY a.codigo DESC
					""", Aula.class).setParameter("codigoTurma", codigoTurma).setMaxResults(1).getSingleResult();

			// Busca os alunos da turma
			// Busca alunos JÁ com a presença nessa aula
			List<Object[]> resultado = em.createQuery("""
					SELECT a, p.presente
					FROM TurmaAluno ta
					JOIN Aluno a ON a.matricula = ta.id.alunoMatricula
					LEFT JOIN Presenca p
					    ON p.id.alunoMatricula = a.matricula
					   AND p.id.aulaCodigo = :codigoAula
					WHERE ta.id.turmaCodigo = :codigoTurma
					""", Object[].class).setParameter("codigoTurma", codigoTurma)
					.setParameter("codigoAula", aula.getCodigo()).getResultList();

			List<AlunoPresencaDTO> alunos = resultado.stream().map(r -> {
				Aluno aluno = (Aluno) r[0];
				Boolean presente = (Boolean) r[1];
				return new AlunoPresencaDTO(aluno.getMatricula(), aluno.getNome(), Boolean.TRUE.equals(presente));
			}).toList();

			// Monta o DTO
			AulaDTO dto = new AulaDTO();

			dto.setAula(aula);
			dto.setTurma(turma);
			dto.setAlunos(alunos);

			return dto;

		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Erro ao buscar dados da aula", e);
		}
	}

	public Aula getEntityFiltrado(Integer codigoTurma) {
		try {

			// 1. Busca a Aula
			Aula aula = em.createQuery("SELECT p FROM Aula p WHERE p.turmaCodigo = :codigo", Aula.class)
					.setParameter("codigo", codigoTurma).getSingleResult();

			return aula;

		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Erro ao buscar dados da aula", e);
		}
	}

	public AulaDTO adicionar(Turma turma, List<Aluno> alunos, Aula aula) throws Exception {

		try {
			aula.setCodigo(getNextCod());

			em.persist(aula);
			for (Aluno aluno : alunos) {

				Presenca presenca = new Presenca();

				presenca.setId(new PresencaId(aluno.getMatricula(), aula.getCodigo()));

				presenca.setPresente();

				em.persist(presenca);

			}
			return null;
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Erro ao adicionar", e);
		}
	}

	public void atualizar(Aula aula, Turma turma, List<AlunoPresencaDTO> alunos) throws Exception {

		try {

			// 1. Busca a aula existente
			Aula aulaBanco = em.find(Aula.class, aula.getCodigo());

			if (aulaBanco == null) {
				throw new Exception("Aula não encontrada");
			}

			// 2. Atualiza os dados da aula
			aulaBanco.setData(aula.getData());

			em.merge(aulaBanco);

			// 3. Remove as presenças antigas dessa aula
			em.createQuery("DELETE FROM Presenca p " + "WHERE p.id.aulaCodigo = :codigo")
					.setParameter("codigo", aula.getCodigo()).executeUpdate();

			// 4. Cria novamente as presenças
			for (AlunoPresencaDTO aluno : alunos) {
				PresencaId id = new PresencaId(aluno.getMatricula(), aula.getCodigo());
				Presenca presenca = new Presenca();
				presenca.setId(id);
				presenca.setPresente(aluno.isPresente()); // usar o valor real
				em.persist(presenca);
			}

		} catch (Exception e) {
			throw new RuntimeException("Erro ao atualizar aula", e);
		}
	}

	public void remover(Aula aula) {

		try {
			em.remove(em.find(Aula.class, aula.getCodigo()));
		} catch (Exception e) {
			throw new RuntimeException("Erro ao remover", e);
		}
	}

	private Integer getNextCod() {

		Query query = em.createQuery("select max(codigo) + 1 from Turma");
		Object cod = query.getSingleResult();

		if (cod == null)
			return 1;

		if (cod instanceof Integer)
			return (Integer) cod;

		if (cod instanceof Long)
			return ((Long) cod).intValue();

		if (cod instanceof Short)
			return ((Short) cod).intValue();

		return (Integer) cod;
	}
}
