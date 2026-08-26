package br.com.kaio.catesys.eps;

import java.util.List;
import java.util.Map;

import br.com.kaio.catesys.bss.AulaBss;
import br.com.kaio.catesys.domain.Aula;
import br.com.kaio.catesys.domain.Turma;
import br.com.kaio.catesys.domain.TurmaAluno;
import br.com.kaio.catesys.eps.dto.AulaDTO;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
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
	public List<TurmaAluno> getAula() {
		return aulaBss.getList();
	}

	@GET
	@Path("/{codigo}")
	public AulaDTO getEntity(@PathParam("codigo") Integer codigo) {

		return aulaBss.getEntity(codigo);
	}

	@GET
	@Path("/listTA")
	public List<Turma> getList() {

		return aulaBss.getTA();
	}

	@POST
	public Aula adicionar(Aula aula) {

		try {
			return aulaBss.adicionar(aula);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
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