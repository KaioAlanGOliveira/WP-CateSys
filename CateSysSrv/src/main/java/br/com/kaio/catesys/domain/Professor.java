package br.com.kaio.catesys.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "professor")
public class Professor {

	@Id
	@Column(name = "matricula")
	private Integer matricula;

	@Column(name = "nome", nullable = false, length = 100)
	private String nome;

	@Column(name = "telefone", length = 11)
	private String telefone;

	@Column(name = "senha", length = 20)
	private String senha;

	@Column(name = "status")
	private Integer status;

	public Professor() {
	}

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

	public String getTelefone() {
		return telefone;
	}

	public void setTelefone(String telefone) {
		this.telefone = telefone;
	}

	public String getSenha() {
		return senha;
	}

	public void setSenha(String senha) {
		this.senha = senha;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}
}
