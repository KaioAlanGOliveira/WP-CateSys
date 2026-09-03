package br.com.kaio.catesys.domain;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;

@Embeddable
public class Presenca implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
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
