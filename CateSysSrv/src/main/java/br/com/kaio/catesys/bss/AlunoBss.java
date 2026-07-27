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
}
