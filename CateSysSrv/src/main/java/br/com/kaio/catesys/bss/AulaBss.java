package br.com.kaio.catesys.bss;

import java.util.List;

import br.com.kaio.catesys.domain.Aluno;
import br.com.kaio.catesys.domain.Aula;
import br.com.kaio.catesys.domain.Professor;
import br.com.kaio.catesys.domain.Turma;
import br.com.kaio.catesys.domain.TurmaAluno;
import br.com.kaio.catesys.eps.dto.AulaDTO;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
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
			String jpql = "	SELECT p FROM Turma p";
			TypedQuery<Turma> query = em.createQuery(jpql, Turma.class);

			return query.getResultList();
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Erro ao listar", e);
		}
	}

	public List<TurmaAluno> getList() {
		try {
			String jpql = "	SELECT p FROM TurmaAluno p";
			TypedQuery<TurmaAluno> query = em.createQuery(jpql, TurmaAluno.class);

			return query.getResultList();
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Erro ao listar", e);
		}
	}

	public AulaDTO getEntity(Integer codigoTurma) {

		try {
			String jpql = """
					    SELECT a
					    FROM Aula a
					    WHERE a.turmaCodigo = :codigoTurma
					""";

			Aula aula = em.createQuery(jpql, Aula.class).setParameter("codigoTurma", codigoTurma).getSingleResult();
			String jpqlProfessor = """
					    SELECT p
					    FROM Turma t
					    JOIN t.professor p
					    WHERE t.codigo = :codigoTurma
					""";
			Professor professor = em.createQuery(jpqlProfessor, Professor.class)
					.setParameter("codigoTurma", codigoTurma).getSingleResult();

			String jpqlAlunos = """
					    SELECT a
					    FROM TurmaAluno ta
					    JOIN ta.aluno a
					    WHERE ta.turma.codigo = :codigoTurma
					""";

			List<Aluno> alunos = em.createQuery(jpqlAlunos, Aluno.class).setParameter("codigoTurma", codigoTurma)
					.getResultList();

			AulaDTO dto = new AulaDTO();

			dto.setCodigo(aula.getCodigo());
			dto.setData(aula.getData());
			dto.setProfessor(professor);
			dto.setAlunos(alunos);

			return dto;
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Erro ao listar", e);
		}
	}

	public Aula adicionar(Aula aula) throws Exception {

		try {
			em.persist(aula);
			return aula;
		} catch (Exception e) {
			throw new RuntimeException("Erro ao adicionar", e);
		}
	}

	public void alterar(Aula aula) {

		try {
			em.merge(aula);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Erro ao atualizar", e);
		}
	}

	public void remover(Aula aula) {

		try {
			em.remove(em.find(Aula.class, aula.getCodigo()));
		} catch (Exception e) {
			throw new RuntimeException("Erro ao remover", e);
		}
	}
}
