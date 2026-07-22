package br.com.kaio.catesys;

import java.util.List;

import br.com.kaio.catesys.bss.AlunoBss;
import br.com.kaio.catesys.domain.Aluno;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

@Path("/")
public class CateSysSrvEndpoint {

	@GET
	public List<Aluno> getAluno() {
		
		return AlunoBss.getList();
	}
}
