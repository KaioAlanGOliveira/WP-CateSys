package br.com.kaio.catesys.bss;

import java.time.LocalDate;
import java.util.List;

import br.com.kaio.catesys.domain.Aluno;
import br.com.kaio.catesys.domain.Aula;
import br.com.kaio.catesys.domain.Presenca;
import br.com.kaio.catesys.domain.Turma;
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

	public List<Turma> getTA() {
		try {
			String jpql = "	SELECT t FROM Turma t";
			TypedQuery<Turma> query = em.createQuery(jpql, Turma.class);

			return query.getResultList();
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Erro ao listar", e);
		}
	}

	public List<Object[]> getList(String codigo, String data, String turmaCodigo) {

	    try {
	        String jpql = """
	                    SELECT a, t
	                    FROM Aula a
	                    LEFT JOIN Turma t ON a.turmaCodigo = t.codigo
	                    WHERE (:codigo IS NULL OR a.codigo = :codigo)
	                    AND (:data IS NULL OR a.data = :data)
	                    AND (:turmaCodigo IS NULL OR a.turmaCodigo = :turmaCodigo)
	                """;

	        TypedQuery<Object[]> query = em.createQuery(jpql, Object[].class);

	        query.setParameter("codigo", codigo);

	        query.setParameter("data",
	                data == null || data.equals("null") || data.isBlank() ? null : LocalDate.parse(data));

	        query.setParameter("turmaCodigo", turmaCodigo);

	        return query.getResultList();

	    } catch (Exception e) {
	        throw e;
	    }
	}


	public AulaDTO getEntity(Integer codigoTurma) {

		try {

			// Busca a turma
			Turma turma = em.createQuery("""
					SELECT t
					FROM Turma t
					WHERE t.codigo = :codigo
					""", Turma.class).setParameter("codigo", codigoTurma).getSingleResult();

			// Busca a última aula dessa turma
			Aula aula = em.createQuery("""
					SELECT a
					FROM Aula a
					WHERE a.turmaCodigo = :codigo
					ORDER BY a.data DESC
					""", Aula.class).setParameter("codigo", codigoTurma).setMaxResults(1).getResultStream().findFirst()
					.orElse(null);

			// Busca as presenças dessa aula
			List<Aluno> alunos = em.createQuery("""
					SELECT a
					FROM TurmaAluno ta
					JOIN Aluno a ON a.matricula = ta.id.alunoMatricula
					WHERE ta.id.turmaCodigo = :codigoTurma
					""", Aluno.class).setParameter("codigoTurma", aula.getTurmaCodigo()).getResultList();

			List<Presenca> presencas = em.createQuery("""
					SELECT p
					FROM Presenca p
					WHERE p.id.aulaCodigo = :codigo
					""", Presenca.class).setParameter("codigo", aula.getCodigo()).getResultList();

			// Monta o DTO
			AulaDTO dto = new AulaDTO();

			dto.setTurma(turma);
			dto.setAula(aula);
			dto.setPresencas(presencas);
			dto.setAlunos(alunos);

			return dto;

		} catch (Exception e) {

			e.printStackTrace();

			throw new RuntimeException("Erro ao buscar dados da aula", e);
		}
	}

	public void alterar(AulaDTO dto) {
		try {

			if (dto.getTurma() != null) {

				Turma turma = em.find(Turma.class, dto.getTurma().getCodigo());

				if (turma != null) {
					turma.setProfessorMatricula(dto.getTurma().getProfessorMatricula());
				}
			}

			if (dto.getPresencas() == null) {
				return;
			}

			for (Presenca presenca : dto.getPresencas()) {

				// Procura a presença existente
				Presenca existente = em.find(Presenca.class, presenca.getId());

				// Apaga a antiga
				if (existente != null) {
					em.remove(existente);
				}

				// Cria a nova
				em.persist(presenca);
			}

			em.flush();

		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Erro ao atualizar presenças", e);
		}
	}

	public void remover(Aula aula) {
		try {

			// Apaga as presenças da aula
			em.createQuery("""
					DELETE FROM Presenca p
					WHERE p.id.aulaCodigo = :codigo
					""").setParameter("codigo", aula.getCodigo()).executeUpdate();

			// Apaga a aula
			Aula aulaExistente = em.find(Aula.class, aula.getCodigo());

			if (aulaExistente != null) {
				em.remove(aulaExistente);
			}

			em.flush();

		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Erro ao apagar aula", e);
		}
	}

	public Aula adicionar(Aula aula) {

		List<Aula> aulasNaMesmaData = em.createQuery("SELECT a FROM Aula a WHERE a.data = :data", Aula.class)
				.setParameter("data", aula.getData()).getResultList();

		if (!aulasNaMesmaData.isEmpty()) {
			return null;
		}

		aula.setCodigo(getNextCod());
		em.persist(aula);
		return aula;
	}

	private Integer getNextCod() {

		Query query = em.createQuery("select max(codigo) + 1 from Aula");
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
