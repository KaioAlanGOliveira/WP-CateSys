package br.com.kaio.catesys.domain;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

@Entity
@Table(name = "turma_aluno")
public class TurmaAluno {

	@EmbeddedId
	private TurmaAlunoId id;

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("turmaCodigo")
	@JoinColumn(name = "turma_codigo")
	private Turma turma;

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("alunoMatricula")
	@JoinColumn(name = "aluno_matricula")
	private Aluno aluno;

	public TurmaAluno() {
	}

	public TurmaAlunoId getId() {
		return id;
	}

	public void setId(TurmaAlunoId id) {
		this.id = id;
	}

	public Turma getTurma() {
		return turma;
	}

	public void setTurma(Turma turma) {
		this.turma = turma;
	}

	public Aluno getAluno() {
		return aluno;
	}

	public void setAluno(Aluno aluno) {
		this.aluno = aluno;
	}
}
