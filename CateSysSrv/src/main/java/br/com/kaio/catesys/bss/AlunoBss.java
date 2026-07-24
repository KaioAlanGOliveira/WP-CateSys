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
		
		if (nome != null && nome.trim().isEmpty()) {
            nome = null;
        }
		if (matricula != null) {
			matricula = null;
        }
		
		try {

			String jpql = " SELECT o FROM Aluno o   WHERE (:matricula IS NULL OR o.matricula = :matricula)  AND (:nome IS NULL OR LOWER(o.nome) LIKE LOWER(CONCAT('%', :nome, '%')))";

			TypedQuery<Aluno> query = em.createQuery(jpql, Aluno.class);
			query.setParameter("nome", nome);
			query.setParameter("matricula", matricula);

			return query.getResultList();
		} catch (Exception e) {
			e.addSuppressed(e);
		}
		return null;
	}
}
