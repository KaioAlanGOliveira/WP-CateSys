package br.com.kaio.catesys.domain;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "ALUNO")
public class Aluno {

	@Id
	@Column(name = "MATRICULA")
	private Integer matricula;

	@Column(name = "NOME")
	private String nome;

	@Column(name = "TELEFONE")
	private String telefone;

	@Column(name = "NOME_RESPONSAVEL")
	private String nomeResponsavel;

	@Column(name = "TELEFONE_RESPONSAVEL")
	private String telefoneResponsavel;

	@Column(name = "DATA_NASCIMENTO")
	private LocalDate dataNascimento;

	@Column(name = "STATUS")
	private Integer status;

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

	public String getNomeResponsavel() {
		return nomeResponsavel;
	}

	public void setNomeResponsavel(String nomeResponsavel) {
		this.nomeResponsavel = nomeResponsavel;
	}

	public String getTelefoneResponsavel() {
		return telefoneResponsavel;
	}

	public void setTelefoneResponsavel(String telefoneResponsavel) {
		this.telefoneResponsavel = telefoneResponsavel;
	}

	public LocalDate getDataNascimento() {
		return dataNascimento;
	}

	public void setDataNascimento(LocalDate dataNascimento) {
		this.dataNascimento = dataNascimento;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}
}
