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
  imports: [ReactiveFormsModule, InputNumber, TableModule, ButtonDirective, InputTextModule, ButtonModule],
  templateUrl: './pesq-aluno-lst.html',
  styleUrls: ['./pesq-aluno-lst.css'],
})
export class PesqAlunoLst {

  public lista: any[] = [];
  public loading: boolean = false;
  public selectedItem: any;

  constructor(private service: AlunoService, public ref: DialogRef<PesqAlunoLst>, private util: UtilService) {
  }

  formAluno = new FormGroup({
    matricula: new FormControl({ value: '', disabled: false }, [Validators.required]),
    nome: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.minLength(3)]),
  })

  public pesquisar() {
    this.loading = true;
    const raw = this.formAluno.getRawValue();
    const filtro: any = {
      ...raw,
      matricula: raw.matricula != null && raw.matricula !== '' ? Number(raw.matricula) : undefined
    };
    
    this.service.listarTodosFiltrados(filtro).subscribe({
      next: (dados) => {
        this.loading = false;
        this.lista = dados || [];
        this.selectedItem = null;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  public selecionar() {
    if (this.selectedItem) {
      this.ref.close(this.selectedItem.matricula);
    }
  }
}