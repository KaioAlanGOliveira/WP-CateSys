package br.com.kaio.catesys.eps;

import java.util.List;
import java.util.Map;

import br.com.kaio.catesys.bss.AulaBss;
import br.com.kaio.catesys.domain.Aula;
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
import jakarta.ws.rs.QueryParam;
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
	public List<Aula> getList(@QueryParam("codigo") String codigo, @QueryParam("turmaCodigo") String turmaCodigo,
			@QueryParam("data") String data) {

		return aulaBss.getList(codigo, data, turmaCodigo);
	}

	@GET
	@Path("/filtradosDTO/{codigo}")
	public AulaDTO getEntity(@PathParam("codigo") Integer codigo) {

		return aulaBss.getEntity(codigo);
	}

	@GET
	@Path("/filtro/{codigo}")
	public Aula getEntityFiltrado(@PathParam("codigo") Integer codigo) {

		return aulaBss.getEntityFiltrado(codigo);
	}

	@GET
	@Path("/listTA")
	public List<Aula> getList() {

		return aulaBss.getTA();
	}

	@GET
	@Path("/ListAlunoT/{codigo}")
	public List<Object[]> getListAlunoT(@PathParam("codigo") Integer codigo) {

		return aulaBss.getTurmaAluno(codigo);
	}

	@POST
	public AulaDTO adicionar(AulaDTO dto) {

		try {
			return aulaBss.adicionar(dto.getTurma(), dto.getAlunos(), dto.getAula());
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
	public void editar(AulaDTO dto) {

		try {
			aulaBss.atualizar(dto.getAula(), dto.getTurma(), dto.getAlunos());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}