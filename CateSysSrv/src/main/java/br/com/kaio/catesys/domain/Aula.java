package br.com.kaio.catesys.domain;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "aula")
public class Aula {

	@Id
	@Column(name = "codigo")
	private Integer codigo;
	
	private LocalDate data;
	
	private Integer presencas;
	
	@Column(name = "turma_codigo")
	private Integer turmaCodigo;

	public Integer getTurmaCodigo() {
	    return turmaCodigo;
	}

	public void setTurmaCodigo(Integer turmaCodigo) {
	    this.turmaCodigo = turmaCodigo;
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

	public Integer getPresencas() {
		return presencas;
	}
	public void setPresencas(Integer presencas) {
		this.presencas = presencas;
	}

}
