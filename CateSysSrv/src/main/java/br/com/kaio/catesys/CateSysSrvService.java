package br.com.kaio.catesys;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class CateSysSrvService {

    public String hello(String name) {
        return String.format("Hello '%s'.", name);
    }
}