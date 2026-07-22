package br.com.kaio.catesys.domain;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "aula")
public class Aula {

	@Id
	@Column(name = "codigo")
	private Integer codigo;

	@Column(name = "data", nullable = false)
	private LocalDate data;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "turma_codigo", nullable = false)
	private Turma turma;

	@OneToMany(mappedBy = "aula")
	private Set<Presenca> presencas = new HashSet<>();

	public Aula() {
	}

	public Integer getCodigo() {
		return codigo;
	}

	public void setCodigo(Integer codigo) {
		this.codigo = codigo;
	}

	public LocalDate getData() {
		return data;
	}

	public void setData(LocalDate data) {
		this.data = data;
	}

	public Turma getTurma() {
		return turma;
	}

	public void setTurma(Turma turma) {
		this.turma = turma;
	}

	public Set<Presenca> getPresencas() {
		return presencas;
	}

	public void setPresencas(Set<Presenca> presencas) {
		this.presencas = presencas;
	}
}
