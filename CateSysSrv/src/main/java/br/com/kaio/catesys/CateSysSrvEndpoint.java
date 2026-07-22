package br.com.kaio.catesys;

import java.util.List;

import br.com.kaio.catesys.bss.AlunoBss;
import br.com.kaio.catesys.domain.Aluno;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/")
@Produces(MediaType.APPLICATION_JSON)
public class CateSysSrvEndpoint {

	@Inject
	private AlunoBss bss;
	
	@GET
	public List<Aluno> getAluno() {
		
		return bss.getList();
	}
}
