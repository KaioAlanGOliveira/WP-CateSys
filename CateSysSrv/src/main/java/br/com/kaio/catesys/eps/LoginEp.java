package br.com.kaio.catesys.eps;

import java.util.Map;

import br.com.kaio.catesys.eps.dto.LoginDto;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

@Path(value = "/login")
public class LoginEp {

	@POST
	public Response  login(LoginDto login) {

		System.out.println(login.getLogin());
		System.out.println(login.getSenha());
		return Response.ok(Map.of("mensagem", "Fiel alterado com sucesso")).build();
	}

}
