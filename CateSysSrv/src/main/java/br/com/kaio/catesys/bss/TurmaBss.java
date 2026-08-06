package br.com.kaio.catesys.bss;

import java.util.List;

import br.com.kaio.catesys.domain.Turma;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

@Stateless
public class TurmaBss {

	@PersistenceContext(unitName = "MeuPu")
	private EntityManager em;

	public List<Turma> getList() {

		try {
			String jpql = "select obj from Turma obj";
			TypedQuery<Turma> query = em.createQuery(jpql, Turma.class);
			return query.getResultList();
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Erro ao listar", e);
		}
	}

	public List<Turma> getListFiltrado(Turma domain) {

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

		query.setParameter("nome", domain.getNome());
		query.setParameter("codigo", domain.getCodigo());
		query.setParameter("status", domain.getStatus());
		query.setParameter("professorMatricula", domain.getProfessorMatricula());
		
		return query.getResultList();
	}

	public void adicionar(Turma domain) throws Exception {

		try {
			em.persist(domain);
		} catch (Exception e) {
			throw new RuntimeException("Erro ao adicionar", e);
		}
	}

	public void alterar(Turma domain) {

		try {
			em.merge(domain);
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
}
