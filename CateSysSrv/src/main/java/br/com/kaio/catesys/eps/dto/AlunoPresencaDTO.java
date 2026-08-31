package br.com.kaio.catesys.eps.dto;

public class AlunoPresencaDTO {
	private Integer matricula;
	private String nome;
	private Integer presente;

	public AlunoPresencaDTO(Integer matricula, String nome, Integer presente) {
		this.matricula = matricula;
		this.nome = nome;
		this.presente = presente;
	}
	// getters e setters

	public Integer getMatricula() {
		return matricula;
	}

	public void setMatricula(Integer matricula) {
		this.matricula = matricula;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public Integer isPresente() {
		return presente;
	}

	public void setPresente(Integer presente) {
		this.presente = presente;
	}
}