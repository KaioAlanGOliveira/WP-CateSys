package br.com.kaio.catesys.eps.dto;

import java.util.List;

import br.com.kaio.catesys.domain.Aluno;
import br.com.kaio.catesys.domain.Aula;
import br.com.kaio.catesys.domain.Presenca;
import br.com.kaio.catesys.domain.Turma;

public class AulaDTO {

	private Turma turma;
	private Aula aula;
	private List<Aluno> alunos;
	private List<Presenca> presecas;

	public List<Presenca> getPresecas() {
		return presecas;
	}

	public void setPresecas(List<Presenca> presecas) {
		this.presecas = presecas;
	}

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

	public List<Aluno> getAlunos() {
		return alunos;
	}

	public void setAlunos(List<Aluno> alunos) {
		this.alunos = alunos;
	}
}
