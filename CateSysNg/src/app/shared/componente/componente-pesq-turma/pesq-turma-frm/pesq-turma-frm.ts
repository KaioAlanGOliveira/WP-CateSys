import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
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
import { json } from 'node:stream/consumers';
import { ProfessorService } from '../../../../service/professor.service';
import { TurmaService } from '../../../../service/turma.service';
import { TurmaDomain } from '../../../../models/turma.model';

@Component({
  selector: 'app-pesq-turma-frm',
  standalone: true,
  imports: [ReactiveFormsModule, InputNumber, TableModule, ButtonDirective, InputTextModule, ButtonModule],
  templateUrl: './pesq-turma-frm.html',
  styleUrls: ['./pesq-turma-frm.css'],
})
export class PesqProfessorLst {
  turmaSelecionado: any = null;
  public lista: TurmaDomain[] = [];
  public loading: boolean = false;
  public selectedItem: any;
  private cdr = inject(ChangeDetectorRef);
  @Input() cmpControleEnabled: Boolean = false;

  constructor(private service: TurmaService, public ref: DialogRef<PesqProfessorLst>, private util: UtilService) {
  }

  formTurma = new FormGroup({
    matricula: new FormControl({ value: '', disabled: false }, [Validators.required]),
    nome: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.minLength(3)]),
  })

  public pesquisar() {
    Promise.resolve().then(() => {
      this.loading = true;
      this.cdr.markForCheck();
    });
    this.loading = true;
    const raw = this.formTurma.getRawValue();
    const filtro: any = {
      ...raw,
      matricula: raw.matricula != null && raw.matricula !== '' ? Number(raw.matricula) : undefined
    };

    this.service.listFiltrados(filtro).subscribe({
      next: (dados) => {
        this.loading = false;
        this.lista = dados || [];
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  protected selecionar() {
    if (this.selectedItem) {
      this.ref.close(this.selectedItem);
      alert(this.selectedItem);
    } else {
      this.util.showMensagem("Selecione um item!")
    }
  }
 // Altere apenas esta função no seu ficheiro .ts para garantir a consistência
selecionarDaTela(item: any) {
  this.selectedItem = item;
  this.turmaSelecionado = item; // Mantém para o seu binding atual do HTML funcionar
}


}