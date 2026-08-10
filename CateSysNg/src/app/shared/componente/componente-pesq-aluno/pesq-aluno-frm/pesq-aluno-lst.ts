import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef } from '../../dialog/models/dialog-ref.model';
import { UtilService } from '../../../../service/util.service';
import { AlunoService } from '../../../../service/aluno.service';
import { InputNumber } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-pesq-aluno-lst',
  standalone: true,
  imports: [ReactiveFormsModule, InputNumber, TableModule, InputTextModule, ButtonModule],
  templateUrl: './pesq-aluno-lst.html',
  styleUrls: ['./pesq-aluno-lst.css'],
})
export class PesqAlunoLst {
  public lista: any[] = [];
  public loading = false;
  public selectedItem: any = null;

  public formAluno = new FormGroup({
    matricula: new FormControl<number | null>(null),
    nome: new FormControl<string | null>(null),
    status: new FormControl<number | null>(null)
  });

  constructor(
    private service: AlunoService,
    public ref: DialogRef<PesqAlunoLst>,
    private util: UtilService
  ) {}

  public pesquisar() {
    this.loading = true;
    const raw = this.formAluno.getRawValue();

    const filtro: any = {
      matricula: raw.matricula != null ? Number(raw.matricula) : undefined,
      nome: raw.nome || undefined,
      status: raw.status != null ? Number(raw.status) : undefined
    };

    this.service.listarTodosFiltrados(filtro).subscribe({
      next: (lista) => {
        this.lista = lista || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  public selecionar() {
    if (this.selectedItem) {
      this.ref.close(this.selectedItem.matricula ?? this.selectedItem[0]);
    }
  }

  public fechar() {
    this.ref.close(null);
  }
}