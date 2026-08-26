package br.com.kaio.catesys.bss;

import java.util.List;

import br.com.kaio.catesys.domain.Aluno;
import br.com.kaio.catesys.domain.Aula;
import br.com.kaio.catesys.domain.Turma;
import br.com.kaio.catesys.domain.TurmaAluno;
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

			// 1. Busca a turma
			Turma turma = em.createQuery("SELECT t FROM Turma t WHERE t.codigo = :codigo", Turma.class)
					.setParameter("codigo", codigoTurma).getSingleResult();

			// 2. Busca os alunos da turma
			List<Aluno> alunos = em.createQuery("""
					SELECT a
					FROM TurmaAluno ta
					JOIN Aluno a ON a.matricula = ta.id.alunoMatricula
					WHERE ta.id.turmaCodigo = :codigoTurma
					""", Aluno.class).setParameter("codigoTurma", codigoTurma).getResultList();

			// 3. Monta o DTO
			AulaDTO dto = new AulaDTO();
			dto.setAlunos(alunos);
			dto.setTurma(turma); 
			

			return dto;

		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Erro ao buscar dados da aula", e);
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
