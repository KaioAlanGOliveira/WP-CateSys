package br.com.kaio.catesys.eps;

import java.util.List;
import java.util.Map;

import br.com.kaio.catesys.bss.ProfessorBss;
import br.com.kaio.catesys.domain.Professor;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path(value = "/professor")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@RequestScoped
public class ProfessorEp {
	@Inject
	private ProfessorBss professorBss;

	@GET
	public List<Professor> getProfessores() {
		return professorBss.getList();
	}
	
	@POST
	@Path("/filtrar")
	public List<Professor> getList(String nome, Integer termo) {
		return professorBss.getListFiltrado(nome, termo);
	}

	@POST
	public String adicionar(Professor professor) {

		try {
			professorBss.adicionar(professor);
			return "Novo cadastrado no banco";
		} catch (Exception e) {
			return e.getMessage();
		}
	}

	@DELETE
	public Response remover(Professor professor) {

		try {
			professorBss.remover(professor);
			return Response.ok(Map.of("mensagem", " apagado com sucesso")).build();
		} catch (Exception e) {
			return Response.serverError().entity(Map.of("erro", e.getMessage())).build();
		}
	}

	@PUT
	public Response editar(Professor professor) {

		try {
			professorBss.alterar(professor);
			return Response.ok(Map.of("mensagem", "Fiel alterado com sucesso")).build();
		} catch (Exception e) {
			return Response.serverError().entity(Map.of("erro", e.getMessage())).build();
		}
	}
}