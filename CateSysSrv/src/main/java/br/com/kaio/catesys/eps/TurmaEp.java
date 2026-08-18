package br.com.kaio.catesys.eps;

import java.util.List;
import java.util.Map;

import br.com.kaio.catesys.bss.TurmaBss;
import br.com.kaio.catesys.domain.Turma;
import br.com.kaio.catesys.domain.TurmaAluno;
import br.com.kaio.catesys.eps.dto.TurmaDto;
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
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path(value = "/turma")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@RequestScoped
public class TurmaEp {

	@Inject
	private TurmaBss turmaBss;

	@GET
	public List<Turma> getList(@QueryParam("codigo") String codigo, @QueryParam("nome") String nome,
			@QueryParam("codProfessor") String codProfessor, @QueryParam("status") String status) {

		return turmaBss.getList(codigo, nome, codProfessor, status);
	}

	@GET
	@Path("/{codigo}")
	public Turma getEntity(@PathParam("codigo") Integer codigo) {

		return turmaBss.getEntity(codigo);
	}

	@GET
	@Path("/listTA")
	public List<TurmaAluno> getList() {

		return turmaBss.getTA();
	}

	@GET
	@Path("/ListAlunoT/{codigo}")
	public List<Object[]> getListAlunoT(@PathParam("codigo") Integer codigo) {

		return turmaBss.getTurmaAluno(codigo);
	}

	@POST
	public String create(TurmaDto domain) {
		try {
			turmaBss.adicionar(domain);
			return "Novo cadastrado no banco";
		} catch (Exception e) {
			return e.getMessage();
		}
	}

	@DELETE
	public Response remover(Turma domain) {

		try {
			turmaBss.remover(domain);
			return Response.ok(Map.of("mensagem", " apagado com sucesso")).build();
		} catch (Exception e) {
			return Response.serverError().entity(Map.of("erro", e.getMessage())).build();
		}
	}

	@PUT
	public Response editar(Turma domain) {

		try {
			turmaBss.alterar(domain);
			return Response.ok(Map.of("mensagem", "Alterado com sucesso")).build();
		} catch (Exception e) {
			return Response.serverError().entity(Map.of("erro", e.getMessage())).build();
		}
	}
}