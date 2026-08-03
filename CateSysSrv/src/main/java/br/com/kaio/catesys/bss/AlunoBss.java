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
}
