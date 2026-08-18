package br.com.kaio.catesys.eps.dto;

import br.com.kaio.catesys.domain.Aluno;
import br.com.kaio.catesys.domain.Turma;

public class TurmaDto {

	private Turma turma;
	private Aluno aluno;

	public Aluno getAluno() {
		return aluno;
	}

	public void setAluno(Aluno aluno) {
		this.aluno = aluno;
	}

	public Turma getTurma() {
		return turma;
	}

	public void setTurma(Turma turma) {
		this.turma = turma;
	}
}
