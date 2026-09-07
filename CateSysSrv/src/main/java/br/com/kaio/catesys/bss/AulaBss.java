package br.com.kaio.catesys.bss;

import java.time.LocalDate;
import java.util.List;

import br.com.kaio.catesys.domain.Aula;
import br.com.kaio.catesys.domain.Presenca;
import br.com.kaio.catesys.domain.Turma;
import br.com.kaio.catesys.eps.dto.AulaDTO;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

@Stateless
public class AulaBss {

	@PersistenceContext(unitName = "MeuPu")
	private EntityManager em;

	public List<Aula> getListAula() {

		try {
			String jpql = "select obj from Aula obj";
			TypedQuery<Aula> query = em.createQuery(jpql, Aula.class);
			return query.getResultList();
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Erro ao listar", e);
		}
	}

	public List<Aula> getTA() {
		try {
			String jpql = "	SELECT p FROM Aula p";
			TypedQuery<Aula> query = em.createQuery(jpql, Aula.class);

			return query.getResultList();
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Erro ao listar", e);
		}
	}

	public List<Aula> getList(String codigo, String data, String turmaCodigo) {

		try {

			String jpql = """
					SELECT a
					FROM Aula a
					WHERE (:codigo IS NULL OR a.codigo = :codigo)
					  AND (:data IS NULL OR a.data = :data)
					  AND (:turmaCodigo IS NULL OR a.turmaCodigo = :turmaCodigo)
					""";

			TypedQuery<Aula> query = em.createQuery(jpql, Aula.class);

			query.setParameter("codigo", codigo);

			query.setParameter("data",
					data == null || data.equals("null") || data.isBlank() ? null : LocalDate.parse(data));

			query.setParameter("turmaCodigo", turmaCodigo);

			return query.getResultList();

		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Erro ao listar aulas", e);
		}
	}

	public AulaDTO getEntity(Integer codigoTurma) {

    try {

        // Busca a turma
        Turma turma = em.createQuery("""
                SELECT t
                FROM Turma t
                WHERE t.codigo = :codigo
                """, Turma.class)
                .setParameter("codigo", codigoTurma)
                .getSingleResult();


        // Busca a última aula dessa turma
        Aula aula = em.createQuery("""
                SELECT a
                FROM Aula a
                WHERE a.turmaCodigo = :codigo
                ORDER BY a.data DESC
                """, Aula.class)
                .setParameter("codigo", codigoTurma)
                .setMaxResults(1)
                .getSingleResult();


        // Busca as presenças dessa aula
        TypedQuery<Presenca> query = em.createQuery("""
                SELECT p
                FROM Presenca p
                LEFT JOIN Aluno a
                    ON a.matricula = p.id.alunoMatricula
                WHERE p.id.aulaCodigo = :codigo
                """, Presenca.class);

        query.setParameter("codigo", aula.getCodigo());

        List<Presenca> presencas = query.getResultList();


        // Monta o DTO
        AulaDTO dto = new AulaDTO();

        dto.setTurma(turma);
        dto.setAula(aula);
        dto.setPresencas(presencas);

        return dto;

    } catch (Exception e) {

        e.printStackTrace();

        throw new RuntimeException(
            "Erro ao buscar dados da aula", e);
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
