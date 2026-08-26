package br.com.kaio.catesys.eps;

import java.util.List;
import java.util.Map;

import br.com.kaio.catesys.bss.TurmaBss;
import br.com.kaio.catesys.domain.Turma;
import br.com.kaio.catesys.domain.TurmaAluno;
import br.com.kaio.catesys.eps.dto.TurmaDTO;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
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

	@POST
	public Turma create(TurmaDTO dto) {
		try {
			return turmaBss.adicionar(dto.getTurma(), dto.getAlunos());
		} catch (Exception e) {
			e.getMessage();
		}
		return null;
	}

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
	@Path("/remover")
	public Response remover(TurmaDTO dto) {

		try {
			turmaBss.remover(dto.getTurma(), dto.getAlunos());
			return Response.ok(Map.of("mensagem", " apagado com sucesso")).build();
		} catch (Exception e) {
			e.printStackTrace();
			return Response.serverError().entity(Map.of("erro", e.getMessage())).build();
		}
	}


	@PUT
	public Response editar(TurmaDTO dto) {

		try {
			turmaBss.alterar(dto.getTurma(), dto.getAlunos());
			return Response.ok(Map.of("mensagem", "Alterado com sucesso")).build();
		} catch (Exception e) {
			return Response.serverError().entity(Map.of("erro", e.getMessage())).build();
		}
	}

	@GET
	@Path("/apagarAll")
	public void apagarAll() {
		turmaBss.apagarAll();
	}

}