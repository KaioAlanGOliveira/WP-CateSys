package br.com.kaio.catesys.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "turma")
public class Turma {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "codigo")
	private Integer codigo;

	@Column(name = "nome", nullable = false, length = 100)
	private String nome;

	@Column(name = "status")
	private Integer status;

	@Column(name = "professor_matricula")
	private Integer professorMatricula;

	public Integer getProfessorMatricula() {
		return professorMatricula;
	}

	public void setProfessorMatricula(Integer professor_matricula) {
		this.professorMatricula = professor_matricula;
	}

	public Integer getCodigo() {
		return codigo;
	}

	public void setCodigo(Integer codigo) {
		this.codigo = codigo;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}
}
