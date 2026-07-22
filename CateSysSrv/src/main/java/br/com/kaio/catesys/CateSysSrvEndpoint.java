package br.com.kaio.catesys;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/")
public class CateSysSrvEndpoint {

    @Inject
    private CateSysSrvService service;

    @GET
    public String ola() {
    	return "olaa";
    }
}
