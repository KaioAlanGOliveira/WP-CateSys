package br.com.kaio.catesys.domain;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "aluno")
public class Aluno {

	@Id
	@Column(name = "matricula")
	private Integer matricula;

	@Column(name = "nome", nullable = false, length = 100)
	private String nome;

	@Column(name = "telefone", length = 11)
	private String telefone;

	@Column(name = "nome_responsavel", length = 100)
	private String nomeResponsavel;

	@Column(name = "telefone_responsavel", length = 11)
	private String telefoneResponsavel;

	@Column(name = "data_nascimento")
	private LocalDate dataNascimento;

	@Column(name = "status")
	private Integer status;

	@ManyToMany(mappedBy = "alunos")
	private Set<Turma> turmas = new HashSet<>();

	@OneToMany(mappedBy = "aluno")
	private Set<Presenca> presencas = new HashSet<>();

	public Aluno() {
	}

	// Getters e Setters

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

	public Set<Turma> getTurmas() {
		return turmas;
	}

	public void setTurmas(Set<Turma> turmas) {
		this.turmas = turmas;
	}

	public Set<Presenca> getPresencas() {
		return presencas;
	}

	public void setPresencas(Set<Presenca> presencas) {
        this.presencas = presencas;
    }
}
