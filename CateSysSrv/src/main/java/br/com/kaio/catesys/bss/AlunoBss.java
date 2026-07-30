package br.com.kaio.catesys.bss;

import java.util.List;

import br.com.kaio.catesys.domain.Aluno;
import br.com.kaio.catesys.persistence.Dao;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Stateless
public class AlunoBss {

	@PersistenceContext(unitName = "MeuPu")
	private EntityManager em;

	public List<Aluno> getAlunos() {

		Dao<Aluno> dao = new Dao<>(em, Aluno.class);
		return dao.getList();
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
			throw new RuntimeException("Erro ao remover o fiel", e);
		}
	}
}
