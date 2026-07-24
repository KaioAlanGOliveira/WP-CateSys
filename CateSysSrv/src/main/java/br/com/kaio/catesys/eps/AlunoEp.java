package br.com.kaio.catesys.eps;

import java.util.List;

import br.com.kaio.catesys.bss.AlunoBss;
import br.com.kaio.catesys.domain.Aluno;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path(value = "/aluno")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@RequestScoped
public class AlunoEp {

	@Inject
	private AlunoBss alunoBss;

	@POST
	public List<Aluno> getAluno() {

		List<Aluno> aluno = alunoBss.getAluno();
		System.out.println(aluno);
		return aluno;

	}
}
