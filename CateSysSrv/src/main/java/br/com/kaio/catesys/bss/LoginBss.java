package br.com.kaio.catesys.bss;

import br.com.kaio.catesys.domain.Professor;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

@Stateless
public class LoginBss {

	@PersistenceContext(unitName = "MeuPu")
	private EntityManager em;

	public Professor getProfessor(String nomeLogin, String senhaLogin) {

		try {
			String jpql = "SELECT o FROM Professor o WHERE o.nome = :nomeLogin AND o.senha = :senhaLogin";
			TypedQuery<Professor> quere = em.createQuery(jpql, Professor.class);
			quere.setParameter("nomeLogin", nomeLogin);
			quere.setParameter("senhaLogin", senhaLogin);

			return quere.getSingleResult();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
}
