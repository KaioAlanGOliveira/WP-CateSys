package br.com.kaio.catesys.domain;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class PresencaId implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "aula_codigo")
	private Integer aulaCodigo;

	@Column(name = "aluno_matricula")
	private Integer alunoMatricula;

	public PresencaId() {
	}

	public PresencaId(Integer aulaCodigo, Integer alunoMatricula) {
		this.aulaCodigo = aulaCodigo;
		this.alunoMatricula = alunoMatricula;
	}

	public Integer getAulaCodigo() {
		return aulaCodigo;
	}

	public void setAulaCodigo(Integer aulaCodigo) {
		this.aulaCodigo = aulaCodigo;
	}

	public Integer getAlunoMatricula() {
		return alunoMatricula;
	}

	public void setAlunoMatricula(Integer alunoMatricula) {
		this.alunoMatricula = alunoMatricula;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}

		if (!(obj instanceof PresencaId)) {
			return false;
		}

		PresencaId outro = (PresencaId) obj;

		return java.util.Objects.equals(aulaCodigo, outro.aulaCodigo)
				&& java.util.Objects.equals(alunoMatricula, outro.alunoMatricula);
	}

	@Override
	public int hashCode() {
		return java.util.Objects.hash(aulaCodigo, alunoMatricula);
	}
}