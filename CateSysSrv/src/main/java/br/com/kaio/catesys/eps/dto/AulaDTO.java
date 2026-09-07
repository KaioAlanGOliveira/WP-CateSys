package br.com.kaio.catesys.eps.dto;

import java.util.List;

import br.com.kaio.catesys.domain.Aluno;
import br.com.kaio.catesys.domain.Aula;
import br.com.kaio.catesys.domain.Presenca;
import br.com.kaio.catesys.domain.Professor;
import br.com.kaio.catesys.domain.Turma;

public class AulaDTO {

	private Aula aula;
	private Turma turma;
	private Professor professor;
	private List<Aluno> alunos;
	private List<Presenca> presencas;

	public Aula getAula() {
		return aula;
	}

	public void setAula(Aula aula) {
		this.aula = aula;
	}

	public Turma getTurma() {
		return turma;
	}

	public void setTurma(Turma turma) {
		this.turma = turma;
	}

	public Professor getProfessor() {
		return professor;
	}

	public void setProfessor(Professor professor) {
		this.professor = professor;
	}

	public List<Aluno> getAlunos() {
		return alunos;
	}

	public void setAlunos(List<Aluno> alunos) {
		this.alunos = alunos;
	}

	public List<Presenca> getPresencas() {
		return presencas;
	}

	public void setPresencas(List<Presenca> presencas) {
		this.presencas = presencas;
	}
}
