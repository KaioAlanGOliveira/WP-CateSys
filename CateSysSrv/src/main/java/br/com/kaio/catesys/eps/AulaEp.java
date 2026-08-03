package br.com.kaio.catesys.eps;

import java.util.List;
import java.util.Map;

import br.com.kaio.catesys.bss.AulaBss;
import br.com.kaio.catesys.domain.Aula;
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

@Path(value = "/aula")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@RequestScoped
public class AulaEp {
	@Inject
	private AulaBss aulaBss;

	@GET
	public List<Aula> getAula() {
		return aulaBss.getList();
	}

	@POST
	@Path("/filtrar")
	public List<Aula> getList(Aula aula) {
		return aulaBss.getListFiltrado(aula);
	}

	@POST
	public String adicionar(Aula aula) {

		try {
			aulaBss.adicionar(aula);
			return "Novo cadastrado no banco";
		} catch (Exception e) {
			return e.getMessage();
		}
	}

	@DELETE
	public Response remover(Aula aula) {

		try {
			aulaBss.remover(aula);
			return Response.ok(Map.of("mensagem", " apagado com sucesso")).build();
		} catch (Exception e) {
			return Response.serverError().entity(Map.of("erro", e.getMessage())).build();
		}
	}

	@PUT
	public Response editar(Aula aula) {

		try {
			aulaBss.alterar(aula);
			return Response.ok(Map.of("mensagem", "Alterado com sucesso")).build();
		} catch (Exception e) {
			return Response.serverError().entity(Map.of("erro", e.getMessage())).build();
		}
	}
}