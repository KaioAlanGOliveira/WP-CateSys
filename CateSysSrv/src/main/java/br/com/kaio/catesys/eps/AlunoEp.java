package br.com.kaio.catesys.eps;

import java.util.List;
import java.util.Map;

import br.com.kaio.catesys.bss.AlunoBss;
import br.com.kaio.catesys.domain.Aluno;
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

@Path(value = "/aluno")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@RequestScoped
public class AlunoEp {
	@Inject
	private AlunoBss alunoBss;

	@GET
	@Path("/ListAlunos")
	public List<Aluno> getAlunos() {
		return alunoBss.getAlunos();
	}

	@GET
	public List<Aluno> getList(@QueryParam("matricula") Integer matricula, @QueryParam("nome") String nome,
			@QueryParam("codProfessor") Integer codProfessor, @QueryParam("status") Integer status) {

		return alunoBss.getListFiltrado(matricula, nome, codProfessor, status);
	}

	@GET
	@Path("/{codigo}")
	public Aluno getEntity(@PathParam("codigo") Integer codigo) {

		return alunoBss.getEntity(codigo);
	}

	@POST
	public Response adicionar(Aluno aluno) {

		try {
			if (aluno != null) {
				alunoBss.adicionar(aluno);
				return Response.ok(Map.of("mensagem", " Adicionado com sucesso")).build();
			}
		} catch (Exception e) {
			return Response.serverError().entity(Map.of("erro", e.getMessage())).build();
		}
		return null;
	}

	@DELETE
	public Response remover(Aluno aluno) {

		try {
			alunoBss.remover(aluno);
			return Response.ok(Map.of("mensagem", " apagado com sucesso")).build();
		} catch (Exception e) {
			return Response.serverError().entity(Map.of("erro", e.getMessage())).build();
		}
	}

	@PUT
	public void editar(Aluno aluno) {

		try {
			alunoBss.alterar(aluno);
		} catch (Exception e) {
		}
	}
}