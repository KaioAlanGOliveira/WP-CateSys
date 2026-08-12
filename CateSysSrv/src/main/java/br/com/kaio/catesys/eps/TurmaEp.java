package br.com.kaio.catesys.eps;

import java.util.List;
import java.util.Map;

import br.com.kaio.catesys.bss.TurmaBss;
import br.com.kaio.catesys.domain.Turma;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path(value = "/turma")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@RequestScoped
public class TurmaEp {

	@Inject
	private TurmaBss TurmaBss;

	@GET
	public List<Turma> getList(@QueryParam("codigo") String codigo, @QueryParam("nome") String nome,
			@QueryParam("codProfessor") String codProfessor, @QueryParam("status") String status) {
		
		return TurmaBss.getList(codigo, nome, codProfessor, status);
	}

	@POST
	public String adicionar(Turma domain) {
		try {
			TurmaBss.adicionar(domain);
			return "Novo cadastrado no banco";
		} catch (Exception e) {
			return e.getMessage();
		}
	}

	@DELETE
	public Response remover(Turma domain) {

		try {
			TurmaBss.remover(domain);
			return Response.ok(Map.of("mensagem", " apagado com sucesso")).build();
		} catch (Exception e) {
			return Response.serverError().entity(Map.of("erro", e.getMessage())).build();
		}
	}

	@PUT
	public Response editar(Turma domain) {

		try {
			TurmaBss.alterar(domain);
			return Response.ok(Map.of("mensagem", "Alterado com sucesso")).build();
		} catch (Exception e) {
			return Response.serverError().entity(Map.of("erro", e.getMessage())).build();
		}
	}
}