import { Component, Input, Output, EventEmitter, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { TurmaService } from '../../../service/turma.service';
import { professor } from '../../../domain/professor.model';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DatePickerModule } from 'primeng/datepicker';
import { TurmaDomain } from '../../../domain/turma.model';

@Component({
  selector: 'app-turma-p',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    DialogModule,
    ButtonModule,
    InputMaskModule,
    MessageModule,
    InputTextModule,
    FormsModule,
    RadioButtonModule,
    DatePickerModule,
  ],
  templateUrl: './turma-p.html',
  styleUrl: './turma-p.css'
})
export class TurmaP implements OnChanges, OnInit {

  turmas: TurmaDomain[] = [];
  formulario!: FormGroup;
  tipoPagamento: any;

  private modo: 'initial' | 'creating' | 'editing' = 'initial';

  @Input() Selecionado: TurmaDomain | null = null;
  @Output() visivelChange = new EventEmitter<boolean>();
  @Input() visivel = false;

  private fb = inject(FormBuilder);
  private turmaService = inject(TurmaService);

  private originalturma: TurmaDomain | null = null;

  ngOnInit() {
    this.initForm();
    // this.formulario.disable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visivel'] && !this.visivel) {
      this.resetToInitialState();
    }

    if (changes['Selecionado'] && this.Selecionado && this.formulario) {
      this.modo = 'initial';
      this.formulario.patchValue(this.Selecionado);
      this.originalturma = { ...this.Selecionado };
    } else if (changes['visivel'] && this.visivel && !this.Selecionado && this.formulario) {
      this.modo = 'creating';
      this.formulario.reset();
    }

    this.atualizarEstadoUI();
  }

  private initForm(): void {
    this.formulario = this.fb.group({
      matricula: [{ value: '', disabled: true }, [Validators.required]],
      nome: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3)]],
      telefone: [{ value: '', disabled: true }],
      status: [{ value: 1, disabled: true }, [Validators.required]]
    });
  }

  carregarTurmas() {
    this.turmaService.listarTodos().subscribe({
      next: (dados) => {
        this.turmas = dados || [];
      }
    });
  }

  // ==================== CONTROLE CENTRALIZADO ====================
  private atualizarEstadoUI(): void {
    if (!this.formulario) return;

    if (this.modo === 'initial') {
      this.formulario.disable();
    } else if (this.modo === 'editing') {
      this.formulario.enable();
      this.formulario.get('matricula')?.disable();
    } else {
      this.formulario.enable();
      this.formulario.get('matricula')?.enable();
    }
  }

  get novoHabilitado() { return this.modo === 'initial'; }
  get alterarHabilitado() { return this.modo === 'initial' && !!this.Selecionado; }
  get apagarHabilitado() { return this.modo === 'initial' && !!this.Selecionado; }
  get salvarHabilitado() { return this.modo !== 'initial'; }
  get cancelarHabilitado() { return this.modo !== 'initial'; }
  get fecharHabilitado() { return true; }

  // ==================== AÇÕES ====================
  novo() {
    this.modo = 'creating';
    this.originalturma = null;
    this.formulario.reset();
    this.formulario.markAllAsDirty();
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    this.formulario.enable();
    this.atualizarEstadoUI();
  }

  editar() {
    if (!this.Selecionado) return;
    this.modo = 'editing';
    this.formulario.patchValue(this.Selecionado);
    this.originalturma = { ...this.Selecionado };
    this.formulario.enable();
    this.formulario.markAllAsDirty();
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    this.atualizarEstadoUI();
  }

  private removerMascaras(valor: any): string {
    if (!valor) return '';
    return valor.toString().replace(/\D/g, '');
  }

  cancelar() {
    if (this.modo === 'creating') {
      this.formulario.reset();
      this.fecharModal();
    } else if (this.modo === 'editing' && this.originalturma) {
      this.formulario.patchValue(this.originalturma);
      this.modo = 'initial';
      this.atualizarEstadoUI();
    }
  }

  fecharModal() {
    this.modo = 'initial';
    this.visivel = false;
    this.originalturma = null;
    this.visivelChange.emit(false);
    this.formulario.reset();
  }

  recarregarPaginaInteira() {
    window.location.reload();
  }

  private resetToInitialState() {
    this.modo = 'initial';
    this.originalturma = null;
    if (this.Selecionado) {
      this.formulario.patchValue(this.Selecionado);
    }
    this.atualizarEstadoUI();
  }


  salvar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const formValue = this.formulario.getRawValue();
    const turmaFormatada: TurmaDomain = {
      ...formValue,
      telefone: this.removerMascaras(formValue.telefone),
    };
    if (this.modo === 'creating') {
      this.salvarNova(turmaFormatada);
      this.fecharModal();
    } else {
      this.atualizar(turmaFormatada);
    }
    this.modo = 'initial';
    this.atualizarEstadoUI();
  }

  private salvarNova(turmaFormatada: TurmaDomain) {

    this.turmaService.salvar(turmaFormatada).subscribe({
      next: () => this.finalizarComSucesso(),
      error: (err) => { alert('Erro ao salvar a turma. A turma já existe.'); console.error('Erro ao salvar:', err); }
    });
  }

  private atualizar(turmaFormatada: TurmaDomain) {
    if (!this.Selecionado) return;

    const atualizado: TurmaDomain = { ...this.Selecionado, ...turmaFormatada };

    this.turmaService.editar(atualizado).subscribe({
      next: (dados) => {
        this.finalizarComSucesso();
      },
      error: (err) => console.error('Erro ao atualizar:', err)
    });
  }

  apagar() {
    const respota = window.confirm('Deseja realmente apagar o selecionado?');
    if (respota) {
      if (!this.Selecionado?.codigo) return;

      this.turmaService.apagar(this.Selecionado).subscribe({
        next: () => { this.finalizarComSucesso(); },
        error: (err) => { alert('Erro ao apagar a turma.'); this.finalizarComSucesso(); },
      });
      this.fecharModal();
    }

  }

  private finalizarComSucesso() {
    this.carregarTurmas();
  }

  habilitarCampos(formulario: FormGroup, habilitar: boolean) {
    Object.keys(formulario.controls).forEach((campo) => {
      const controle = formulario.get(campo);
      if (controle) {
        if (habilitar) {
          controle.enable();
        } else {
          controle.disable();
        }
      }
    });
  }
}