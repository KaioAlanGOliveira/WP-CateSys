package br.com.kaio.catesys.persistence;

import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.ws.rs.core.Application;

public class Dao<T> extends Application {

	private EntityManager em;
	private Class<T> entityClass;

	public Dao(EntityManager em, Class<T> entityClass) {

		this.entityClass = entityClass;
		this.em = em;
	}

	public List<T> getList() {

		try {
			String jpql = "select obj from " +  entityClass.getSimpleName()  + " obj";
			TypedQuery<T> query = em.createQuery(jpql, entityClass);
			return query.getResultList();
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Erro ao listar alunos", e);
		}
	}
}
