import { ChangeDetectorRef, Component, EventEmitter, forwardRef, inject, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogService } from '../dialog/services/dialog.service';
import { aluno } from '../../../models/aluno.model';
import { PesqAlunoLst } from './pesq-professor-frm/pesq-professor-lst';
import { CommonModule } from '@angular/common';
import { ProfessorService } from '../../../service/professor.service';

@Component({
  selector: 'cmp-componente-professor',
  templateUrl: './componente-professor.html',
  styleUrls: ['./componente-professor.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, InputNumber, InputTextModule, ButtonModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => ComponenteProfessor)
  }],
})
export class ComponenteProfessor implements ControlValueAccessor {

  private cdr = inject(ChangeDetectorRef);

  @ViewChild("input") private input?: InputNumber;

  @Output() public preenchido = new EventEmitter<any>();

  @Input() public inputId?: string;
  @Input() public disabled?: boolean;
  @Input() public matricula: boolean | undefined;
  @Input() public proximoCampo: string | undefined;
  @Input() public enableCelular: boolean = false;
  @Input() public colaborador: boolean = false;

  private viaSet: boolean = false;
  public loading: boolean = false;

  private _entity: aluno | null = null;

  public form = new FormGroup({
    matricula: new FormControl<number | null>(null),
    nome: new FormControl<string | null>(null),
    celular: new FormControl<string | null>(null),
  });

  public onChange = (matricula: number | null) => { };

  constructor(private service: ProfessorService, private dialogService: DialogService) {
  }

  protected getEntity(matricula: number) {
    if (matricula != null) {
      this.form.controls.matricula.patchValue(matricula);

      Promise.resolve().then(() => {
        this.loading = true;
        this.cdr.markForCheck();
      });

      const filtro: any = { matricula: matricula };

      this.service.listFiltrados(filtro).subscribe({
        next: (lista) => {
          this.loading = false;
          const entity = (lista && lista.length) ? lista[0] : null;

          if (!this.validaEntity(entity)) {
            this.cdr.markForCheck();
            return;
          }

          this._entity = entity;
          this.form.controls.nome.patchValue(entity?.nome ?? null);
          this.cdr.markForCheck();

          this.onChange(entity?.matricula ?? null);
          this.preenchido.emit();

          this.cdr.markForCheck();
        },
        error: () => {
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
    }
  }

  private validaEntity(entity: aluno | null) {

    if (!entity) {
      return false;
    }
    return true;
  }
  public get entity(): aluno | null {
    return this._entity;
  }

  public get value() {
    return this.form.getRawValue();
  }

  public show() {

    let ref = this.dialogService.open(PesqAlunoLst, {
      title: 'Pesq. aluno',
      width: '550px',
      height: '400px',
      closeButton: true,
      esc: true
    });

    ref.onClose.subscribe(matricula => {
      this.focus();
      if (matricula) {
        this.viaSet = false;
        this.getEntity(matricula);
      }
    });
  }

  public keydown(event: KeyboardEvent) {
    if (event.key == 'Enter') {
      const matricula = this.form.getRawValue().matricula;
      if (matricula) {
        this.viaSet = false;
        this.getEntity(matricula);
      }
    } else if (event.key == '*') {
      this.show();
    }
  }

  public limpar() {
    this._entity = null;
    this.form.controls.nome.patchValue(null);
    this.form.controls.celular.patchValue(null);
    this.loading = false;
    this.onChange(null);
  }

  public limparTudo() {
    this.form.controls.matricula.patchValue(null);
    this.limpar();
  }

  private focus() {
    setTimeout(() => {
      this.input?.input?.nativeElement?.focus();
    })
  }

  public writeValue(matricula: any): void {
    if (matricula) {
      this.viaSet = true;
      this.getEntity(matricula);
    } else {
      this.limparTudo();
    }
  }

  public registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched() {}

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

}
//  public showErro(msg: string): DialogRef<DialogMensagemComponent> {
//     let ref = this.dialogService.open(DialogMensagemComponent, {
//       title: 'Erro!',
//       closeButton: true,
//       esc: true
//     });

//     ref.componentInstance.mensagem = msg;

//     return ref;
//   }

//   public showMensagem(msg: string): DialogRef<DialogMensagemComponent> {
//     let ref = this.dialogService.open(DialogMensagemComponent, {
//       title: 'Opa!',
//       closeButton: true,
//       esc: true
//     });

//     ref.componentInstance.mensagem = msg;

//     return ref;
//   }