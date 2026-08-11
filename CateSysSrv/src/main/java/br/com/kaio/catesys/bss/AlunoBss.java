package br.com.kaio.catesys.bss;

import java.util.List;

import br.com.kaio.catesys.domain.Aluno;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

@Stateless
public class AlunoBss {

	@PersistenceContext(unitName = "MeuPu")
	private EntityManager em;

	public List<Aluno> getAlunos() {

		try {
			String jpql = "select obj from Aluno obj";
			TypedQuery<Aluno> query = em.createQuery(jpql, Aluno.class);
			return query.getResultList();
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Erro ao listar", e);
		}
	}

	public void adicionar(Aluno aluno) throws Exception {

		try {
			em.persist(aluno);
		} catch (Exception e) {
			throw new RuntimeException("Erro ao adicionar", e);
		}
	}

	public void alterar(Aluno aluno) {

		try {
			em.merge(aluno);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Erro ao atualizar", e);
		}
	}

	public void remover(Aluno aluno) {

		try {
			em.remove(em.find(Aluno.class, aluno.getMatricula()));
		} catch (Exception e) {
			throw new RuntimeException("Erro ao remover", e);
		}
	}

	public List<Aluno> getListFiltrado(Aluno domain) {

		try {
			String jpql = """
					SELECT a
					FROM Aluno a
					WHERE (:nome IS NULL OR :nome = '' OR
					       LOWER(a.nome) LIKE LOWER(CONCAT('%', :nome, '%')))
					  AND (:matricula IS NULL OR a.matricula = :matricula)
					""";

			TypedQuery<Aluno> query = em.createQuery(jpql, Aluno.class);

			query.setParameter("nome", domain.getNome());
			query.setParameter("matricula", domain.getMatricula());

			return query.getResultList();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
}
