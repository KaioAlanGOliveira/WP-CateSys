package br.com.kaio.catesys.bss;

import java.util.List;

import br.com.kaio.catesys.domain.Professor;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

@Stateless
public class ProfessorBss {

	@PersistenceContext(unitName = "MeuPu")
	private EntityManager em;

	public List<Professor> getList() {

		try {
			String jpql = "select obj from Professor obj";
			TypedQuery<Professor> query = em.createQuery(jpql, Professor.class);
			return query.getResultList();
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Erro ao listar", e);
		}
	}

	public List<Professor> getListFiltrado(Professor pf) {

	    String jpql = """
	        SELECT p
	        FROM Professor p
	        WHERE (:nome IS NULL OR :nome = '' OR
	               LOWER(p.nome) LIKE LOWER(CONCAT('%', :nome, '%')))
	          AND (:matricula IS NULL OR p.matricula = :matricula)
	        """;

	    TypedQuery<Professor> query = em.createQuery(jpql, Professor.class);

	    query.setParameter("nome", pf.getNome());
	    query.setParameter("matricula", pf.getMatricula());

	    return query.getResultList();
	}

	public void adicionar(Professor professor) throws Exception {

		try {
			em.persist(professor);
		} catch (Exception e) {
			throw new RuntimeException("Erro ao adicionar", e);
		}
	}

	public void alterar(Professor professor) {

		try {
			em.merge(professor);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Erro ao atualizar", e);
		}
	}

	public void remover(Professor professor) {

		try {
			em.remove(em.find(Professor.class, professor.getMatricula()));
		} catch (Exception e) {
			throw new RuntimeException("Erro ao remover o fiel", e);
		}
	}
}
