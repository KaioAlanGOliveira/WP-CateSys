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
import jakarta.ws.rs.Produces;
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
	public List<Aluno> getAlunos() {
		return alunoBss.getAlunos();
	}

	@POST
	@Path("/filtrar")
	public List<Aluno> getList(Aluno domain) {
		return alunoBss.getListFiltrado(domain);
	}

	@POST
	public Response adicionar(Aluno aluno) {

		try {
			if (aluno != null) {
				alunoBss.adicionar(aluno);
				return Response.ok(Map.of("mensagem", " apagado com sucesso")).build();
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
	public Response editar(Aluno aluno) {

		try {
			alunoBss.alterar(aluno);
			return Response.ok(Map.of("mensagem", "Fiel alterado com sucesso")).build();
		} catch (Exception e) {
			return Response.serverError().entity(Map.of("erro", e.getMessage())).build();
		}
	}
}