package br.com.kaio.catesys.domain;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "turma_aluno")
public class TurmaAluno {

	@EmbeddedId
	private TurmaAlunoId id;

	public TurmaAluno() {
	}

	public TurmaAlunoId getId() {
		return id;
	}

	public void setId(TurmaAlunoId id) {
		this.id = id;
	}
}
