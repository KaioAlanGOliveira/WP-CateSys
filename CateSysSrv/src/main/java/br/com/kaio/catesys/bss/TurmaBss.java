package br.com.kaio.catesys.bss;

import java.util.List;

import br.com.kaio.catesys.domain.Aluno;
import br.com.kaio.catesys.domain.Turma;
import br.com.kaio.catesys.domain.TurmaAluno;
import br.com.kaio.catesys.domain.TurmaAlunoId;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;

@Stateless
public class TurmaBss {

	@PersistenceContext(unitName = "MeuPu")
	private EntityManager em;

	public List<Turma> getList(String codigo, String nome, String codProfessor, String status) {

		try {
			String jpql = """
					SELECT p
					FROM Turma p
					WHERE (:nome IS NULL OR :nome = '' OR
					       LOWER(p.nome) LIKE LOWER(CONCAT('%', :nome, '%')))
					 AND (:codigo IS NULL OR p.codigo = :codigo)
					 AND (:status IS NULL OR p.status = :status)
					 AND (:professorMatricula IS NULL OR p.professorMatricula = :professorMatricula)
						   """;
			TypedQuery<Turma> query = em.createQuery(jpql, Turma.class);

			query.setParameter("nome", nome);
			query.setParameter("codigo", codigo.equals("null") ? null : codigo);
			query.setParameter("status", status);
			query.setParameter("professorMatricula", codProfessor);

			return query.getResultList();
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Erro ao listar", e);
		}
	}

	public Turma getEntity(Integer codigo) {

		try {
			String jpql = "	SELECT p FROM Turma p WHERE p.codigo = :codigo";
			TypedQuery<Turma> query = em.createQuery(jpql, Turma.class);
			query.setParameter("codigo", codigo);

			return query.getSingleResult();
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

	public void alterar(Turma turma, List<Aluno> alunos) {

		try {
			em.merge(turma);

			for (Aluno aluno : alunos) {
				em.persist(aluno);
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Erro ao atualizar", e);
		}
	}

	public void remover(Turma domain) {

		try {
			em.remove(em.find(Turma.class, domain.getCodigo()));
		} catch (Exception e) {
			throw new RuntimeException("Erro ao remover", e);
		}
	}

	public List<TurmaAluno> getTA() {
		try {
			String jpql = "	SELECT p FROM TurmaAluno p";
			TypedQuery<TurmaAluno> query = em.createQuery(jpql, TurmaAluno.class);

			return query.getResultList();
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Erro ao listar", e);
		}
	}

	public Turma adicionar(Turma turma, List<Aluno> alunos) {

		try {

			turma.setCodigo(getNextCod());
			em.persist(turma);

			for (Aluno aluno : alunos) {

				TurmaAluno tas = new TurmaAluno();
				tas.setId(new TurmaAlunoId(turma.getCodigo(), aluno.getMatricula()));

				em.persist(tas);
			}
			return turma;

		} catch (Exception e) {
			throw new RuntimeException("Erro ao adicionar aluno na turma", e);
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

	public void apagarAll() {

		try {
			em.createQuery("DELETE FROM TurmaAluno").executeUpdate();
			em.createQuery("DELETE FROM Turma").executeUpdate();
		} catch (Exception e) {
			throw new RuntimeException("Erro ao remover", e);
		}
	}
}
