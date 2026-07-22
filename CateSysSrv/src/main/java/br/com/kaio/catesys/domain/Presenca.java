package br.com.kaio.catesys.domain;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

@Entity
@Table(name = "presenca")
public class Presenca {

	@EmbeddedId
	private PresencaId id;

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("aulaCodigo")
	@JoinColumn(name = "aula_codigo")
	private Aula aula;

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("alunoMatricula")
	@JoinColumn(name = "aluno_matricula")
	private Aluno aluno;

	@Column(name = "presente")
	private Integer presente;

	public Presenca() {
	}

	public PresencaId getId() {
		return id;
	}

	public void setId(PresencaId id) {
		this.id = id;
	}

	public Aula getAula() {
		return aula;
	}

	public void setAula(Aula aula) {
		this.aula = aula;
	}

	public Aluno getAluno() {
		return aluno;
	}

	public void setAluno(Aluno aluno) {
		this.aluno = aluno;
	}

	public Integer getPresente() {
		return presente;
	}

	public void setPresente(Integer presente) {
		this.presente = presente;
	}
}