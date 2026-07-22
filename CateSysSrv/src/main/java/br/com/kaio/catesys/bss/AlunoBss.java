package br.com.kaio.catesys.bss;

import java.util.List;

import br.com.kaio.catesys.domain.Aluno;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

@Stateless
public class AlunoBss {

	@PersistenceContext
	private static EntityManager em;

	@SuppressWarnings("unused")
	public static List<Aluno> getList() {

		try {
			String jpql = "select from aluno";
			TypedQuery<Aluno> quere = em.createQuery(jpql, Aluno.class);
			return quere.getResultList();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

}
