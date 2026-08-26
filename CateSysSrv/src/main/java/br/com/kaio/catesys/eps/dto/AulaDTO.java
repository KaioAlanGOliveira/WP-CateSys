package br.com.kaio.catesys.eps.dto;

import java.time.LocalDate;
import java.util.List;
import br.com.kaio.catesys.domain.Aluno;
import br.com.kaio.catesys.domain.Professor;

public class AulaDTO {

    private Integer codigo;
    private LocalDate data;
    private Professor professor;
    private List<Aluno> alunos;

    // Métodos Getter e Setter para 'codigo'
    public Integer getCodigo() {
        return codigo;
    }

    public void setCodigo(Integer codigo) {
        this.codigo = codigo;
    }

    // Métodos Getter e Setter para 'data'
    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    // Métodos Getter e Setter para 'professor'
    public Professor getProfessor() {
        return professor;
    }

    public void setProfessor(Professor professor) {
        this.professor = professor;
    }

    // Métodos Getter e Setter para 'alunos'
    public List<Aluno> getAlunos() {
        return alunos;
    }

    public void setAlunos(List<Aluno> alunos) {
        this.alunos = alunos;
    }
}
