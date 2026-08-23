package br.com.kaio.catesys.bss;

import java.util.List;

import br.com.kaio.catesys.domain.Aula;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

@Stateless
public class AulaBss {

	@PersistenceContext(unitName = "MeuPu")
	private EntityManager em;

	public List<Aula> getList() {

		try {
			String jpql = "select obj from Aula obj";
			TypedQuery<Aula> query = em.createQuery(jpql, Aula.class);
			return query.getResultList();
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Erro ao listar", e);
		}
	}

	public List<Aula> getListFiltrado(Aula aula) {

	    String jpql = """
	        SELECT p
	        FROM Aula p
	        WHERE (:cod IS NULL OR p.cod = :cod)
	        """;

	    TypedQuery<Aula> query = em.createQuery(jpql, Aula.class);

	    query.setParameter("cod", aula.getCodigo());
	    return query.getResultList();
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
