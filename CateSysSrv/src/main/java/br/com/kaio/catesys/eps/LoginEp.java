package br.com.kaio.catesys.eps;

import java.util.Map;

import br.com.kaio.catesys.bss.LoginBss;
import br.com.kaio.catesys.domain.Professor;
import br.com.kaio.catesys.eps.dto.LoginDto;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path(value = "/login")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@RequestScoped
public class LoginEp {

	@Inject
	private LoginBss loginBss;

	@POST
	public Response login(LoginDto login) {

		Professor professor = loginBss.getProfessor(login.getLogin(), login.getSenha());

		if (professor == null) {

			Map<String, String> resposta = Map.of("status", "fracasso");
			return Response.ok(resposta).build();
		}

		Map<String, String> resposta = Map.of("status", "sucesso");

		return Response.ok(resposta)
				// Estas linhas dão a permissão que o navegador (Angular) exige:
				.header("Access-Control-Allow-Origin", "http://localhost:4200")
				.header("Access-Control-Allow-Headers", "origin, content-type, accept, authorization")
				.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD").build();

	}
}
