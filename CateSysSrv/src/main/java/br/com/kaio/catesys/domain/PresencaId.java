package br.com.kaio.catesys.domain;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;

@Embeddable
public class PresencaId implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Integer aulaCodigo;

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
	public boolean equals(Object o) {
		if (this == o)
			return true;

		if (!(o instanceof PresencaId)) {
			return false;
		}

		PresencaId that = (PresencaId) o;

		return Objects.equals(aulaCodigo, that.aulaCodigo) && Objects.equals(alunoMatricula, that.alunoMatricula);
	}

	@Override
	public int hashCode() {
		return Objects.hash(aulaCodigo, alunoMatricula);
	}
}
