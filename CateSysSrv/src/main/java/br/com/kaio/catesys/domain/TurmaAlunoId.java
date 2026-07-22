package br.com.kaio.catesys.domain;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;

@Embeddable
public class TurmaAlunoId implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Integer turmaCodigo;

	private Integer alunoMatricula;

	public TurmaAlunoId() {
	}

	public TurmaAlunoId(Integer turmaCodigo, Integer alunoMatricula) {
		this.turmaCodigo = turmaCodigo;
		this.alunoMatricula = alunoMatricula;
	}

	public Integer getTurmaCodigo() {
		return turmaCodigo;
	}

	public void setTurmaCodigo(Integer turmaCodigo) {
		this.turmaCodigo = turmaCodigo;
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

		if (!(o instanceof TurmaAlunoId)) {
			return false;
		}

		TurmaAlunoId that = (TurmaAlunoId) o;

		return Objects.equals(turmaCodigo, that.turmaCodigo) && Objects.equals(alunoMatricula, that.alunoMatricula);
	}

	@Override
	public int hashCode() {
		return Objects.hash(turmaCodigo, alunoMatricula);
	}
}
