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

	public List<Aluno> getAluno(Integer matricula, String nome) {
		try {

			String jpql = "SELECT o FROM Aluno o WHERE o.matricula = :matricula AND o.nome = :nome";
			
			TypedQuery<Aluno> quere = em.createQuery(jpql, Aluno.class);
			quere.setParameter("nome", nome);
			quere.setParameter("matricula", matricula);

			return quere.getResultList();
		} catch (Exception e) {
			e.addSuppressed(e);
			System.out.println("klj");
		}
		return null;
	}
}
