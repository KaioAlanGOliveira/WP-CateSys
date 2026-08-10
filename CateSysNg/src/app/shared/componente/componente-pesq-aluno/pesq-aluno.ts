import { Component, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogService } from '../dialog/services/dialog.service';
import { AlunoD } from '../../../models/aluno.model';
import { AlunoService } from '../../../service/aluno.service';
import { UtilService } from '../../../service/util.service';
import { PesqAlunoLst } from './pesq-aluno-frm/pesq-aluno-lst';
import { DialogMensagemComponent } from '../dialog/dialog-mensagem/dialog-mensagem.component';
import { DialogRef } from '../dialog/models/dialog-ref.model';
import { proximoCampo } from '../../directives/proximo-campo/proximo-campo.directive';

@Component({
  selector: 'cmp-componente-aluno',
  templateUrl: './pesq-aluno.html',
  styleUrls: ['./pesq-aluno.css'],
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, InputNumber],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => ComponenteAluno)
  }],
})
export class ComponenteAluno implements ControlValueAccessor {

  @ViewChild("input") private input?: InputNumber;

  @Output() public preenchido = new EventEmitter<AlunoD | null>();
  @Output() public alunoSelecionado = new EventEmitter<AlunoD | null>();

  @Input() public inputId?: string;
  @Input() public disabled?: boolean;
  @Input() public matricula: boolean | undefined;
  @Input() public proximoCampo: string | undefined;
  @Input() public enableCelular: boolean = false;
  @Input() public colaborador: boolean = false;

  private viaSet: boolean = false;
  public loading: boolean = false;

  private _entity: AlunoD | null = null;

  form = new FormGroup({
    matricula: new FormControl<number | null>(null),
    nome: new FormControl<string | null>(null)
  });

  public onChange = (matricula: number | null) => { };

  constructor(private service: AlunoService, private util: UtilService, private dialogService: DialogService) {
  }

  protected getEntity(matricula: number | null) {
    this.form.controls.matricula.patchValue(matricula);
    if (matricula != null) {
      this.loading = true;
      const filtro: any = { matricula: matricula };
      this.service.listarTodosFiltrados(filtro).subscribe({
        next: (lista) => {
          this.loading = false;
          const entity = (lista && lista.length) ? lista[0] : null;
          
          if (!this.validaEntity(entity)) {
            return;
          }
          
          this._entity = entity;
          this.form.controls.nome.patchValue((entity as any)?.nome ?? null);
          this.onChange(entity?.matricula ?? null);
          this.preenchido.emit(entity);
          this.alunoSelecionado.emit(entity);
          if (!this.viaSet && this.proximoCampo) {
            proximoCampo(this.proximoCampo);
          }
        },
        error: () => { this.loading = false; }
      });
    }
  }
  private validaEntity(entity: AlunoD | null) {

    if (!entity) {
      return false;
    }
    return true;
  }
  public get entity(): AlunoD | null {
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
      this.getEntity(this.form.getRawValue().matricula);
      this.viaSet = false;
    } else if (event.key == '*') {
      this.show();
    }
  }

  public limpar() {
    this._entity = null;
    this.form.controls.nome.patchValue(null);
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

  public registerOnTouched(fn: any): void { }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }



  public showErro(msg: string): DialogRef<DialogMensagemComponent> {

    let ref = this.dialogService.open(DialogMensagemComponent, {
      title: 'Erro!',
      closeButton: true,
      esc: true
    });

    return ref;
  }
  public showMensagem(msg: string): DialogRef<DialogMensagemComponent> {
    let ref = this.dialogService.open(DialogMensagemComponent, {
      title: 'Opa!',
      closeButton: true,
      esc: true
    });

    return ref;
  }
}