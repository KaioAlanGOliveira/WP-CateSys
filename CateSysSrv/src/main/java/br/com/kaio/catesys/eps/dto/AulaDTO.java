package br.com.kaio.catesys.eps.dto;

import java.util.List;

import br.com.kaio.catesys.domain.Aula;
import br.com.kaio.catesys.domain.Turma;

public class AulaDTO {

	private Turma turma;
	private Aula aula;
	private List<AlunoPresencaDTO> alunos;

	public Turma getTurma() {
		return turma;
	}

	public Aula getAula() {
		return aula;
	}

	public void setAula(Aula aula) {
		this.aula = aula;
	}

	public void setTurma(Turma turma) {
		this.turma = turma;
	}

	public List<AlunoPresencaDTO> getAlunos() {
		return alunos;
	}

	public void setAlunos(List<AlunoPresencaDTO> alunos) {
		this.alunos = alunos;
	}
}
