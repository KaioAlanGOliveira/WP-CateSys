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
	private Integer turmaCodigo;

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

	public Integer getTurmaCodigo() {
		return turmaCodigo;
	}
	public void setTurmaCodigo(Integer presencas) {
		this.turmaCodigo = presencas;
	}

}
