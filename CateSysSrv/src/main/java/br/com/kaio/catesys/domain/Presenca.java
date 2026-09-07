package br.com.kaio.catesys.domain;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "presenca")
public class Presenca {

	@Column(name = "presente")
	Integer presente;

	@EmbeddedId
	PresencaId id;

	public Integer getPresente() {
		return presente;
	}

	public void setPresente(Integer presente) {
		this.presente = presente;
	}

	public PresencaId getId() {
		return id;
	}

	public void setId(PresencaId id) {
		this.id = id;
	}

}
