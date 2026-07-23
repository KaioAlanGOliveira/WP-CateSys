package br.com.kaio.catesys.eps;

import java.util.Map;

import br.com.kaio.catesys.eps.dto.LoginDto;
import jakarta.enterprise.context.RequestScoped;
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

	@POST

	public Response login(LoginDto login) {

		System.out.println(login.getLogin());
		System.out.println(login.getSenha());
		Map<String, String> resposta = Map.of("status", "sucesso");

		  return Response.ok(resposta)
		            // Estas linhas dão a permissão que o navegador (Angular) exige:
		            .header("Access-Control-Allow-Origin", "http://localhost:4200")
		            .header("Access-Control-Allow-Headers", "origin, content-type, accept, authorization")
		            .header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD")
		            .build();
		}

	}
}
