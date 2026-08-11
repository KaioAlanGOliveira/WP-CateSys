import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { DialogRef } from '../../dialog/models/dialog-ref.model';
import { UtilService } from '../../../../service/util.service';
import { AlunoService } from '../../../../service/aluno.service';
import { DatePicker } from "primeng/datepicker";
import { InputNumber } from "primeng/inputnumber";
import { TableModule } from "primeng/table";
import { ButtonDirective } from "primeng/button";
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-pesq-aluno-lst',
  standalone: true,
  imports: [ReactiveFormsModule, DatePicker, InputNumber, TableModule, ButtonDirective, InputTextModule, ButtonModule],
  templateUrl: './pesq-aluno-lst.html',
  styleUrls: ['./pesq-aluno-lst.css'],
})
export class PesqAlunoLst {

  public lista: any[] = [];
  public loading: boolean = false;
  public selectedItem: any;

  constructor(private service: AlunoService, public ref: DialogRef<PesqAlunoLst>, private util: UtilService) {
  }

  public formAluno = new FormGroup({
    matricula: new FormControl({ value: '', disabled: true }, [Validators.required]),
    nome: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.minLength(3)]),
    telefone: new FormControl({ value: '', disabled: true }),
    nomeResponsavel: new FormControl({ value: '', disabled: true }, [Validators.required]),
    telefoneResponsavel: new FormControl({ value: '', disabled: true }),
    dataNascimento: new FormControl({ value: null, disabled: true }, [Validators.required]),
    idadeAtual: new FormControl({ value: null, disabled: true }),
    status: new FormControl({ value: 1, disabled: true }, [Validators.required])
  })




  public pesquisar() {
    this.loading = true;
    const raw = this.formAluno.getRawValue();
    const filtro: any = {
      ...raw,
      // convert matricula from string|null to number|undefined as expected by service
      matricula: raw.matricula != null && raw.matricula !== '' ? Number(raw.matricula) : undefined,
      // ensure status is number or undefined
      status: raw.status != null ? Number(raw.status) : undefined
    };

    this.service.listarTodosFiltrados(filtro).subscribe({
      next: (lista) => {
        this.lista = lista;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  public selecionar() {
    if (this.selectedItem) {
      this.ref.close(this.selectedItem[0]);
    } else {
    }
  }
}