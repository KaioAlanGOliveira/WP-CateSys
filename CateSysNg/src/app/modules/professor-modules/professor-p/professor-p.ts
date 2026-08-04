import { Component, Input, Output, EventEmitter, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumber } from "primeng/inputnumber";
import { ProfessorService } from '../../../service/professor.service';
import { professor } from '../../../domain/professor.model';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DatePickerModule } from 'primeng/datepicker';
import { log } from 'console';

@Component({
  selector: 'app-pops',
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
  templateUrl: './professor-p.html',
  styleUrl: './professor-p.css'
})
export class ProfessorP implements OnChanges, OnInit {

  professores: professor[] = [];
  formulario!: FormGroup;
  tipoPagamento: any;

  private modo: 'initial' | 'creating' | 'editing' = 'creating';

  @Input() Selecionado: professor | null = null;
  @Output() visivelChange = new EventEmitter<boolean>();
  @Input() visivel = false;

  private fb = inject(FormBuilder);
  private professService = inject(ProfessorService);

  private originalprofessor: professor | null = null;

  ngOnInit() {
    this.initForm();
    // this.formulario.disable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visivel'] && !this.visivel) {
      this.resetToInitialState();
    }

    if (changes['Selecionado'] && this.Selecionado && this.formulario) {
      this.modo = 'editing';
      this.formulario.patchValue(this.Selecionado);
      this.originalprofessor = { ...this.Selecionado };
      this.formulario.disable();
    } else {
      this.modo = 'creating';
      this.formulario.enable();
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

  carregarProfessores() {
    this.professService.listarTodos().subscribe({
      next: (dados) => {
        this.professores = dados || [];
      }
    });
  }

  // ==================== CONTROLE CENTRALIZADO ====================
  private atualizarEstadoUI(): void {
    if (!this.formulario) return;


    if (this.modo === 'editing') {
      this.formulario.get('matricula')?.disable();
    }
    if (this.modo === 'creating') {
      this.habilitarCampos(this.formulario, true);
    }

  }

  get novoHabilitado() { return this.modo === 'initial'; }
  get alterarHabilitado() { return this.modo === 'initial' && !!this.Selecionado; }
  get apagarHabilitado() { return this.modo === 'initial' && !!this.Selecionado; }
  get fecharHabilitado() { return this.modo === 'initial'; }
  get salvarHabilitado() { return this.modo !== 'initial'; }
  get cancelarHabilitado() { return this.modo !== 'initial'; }

  // ==================== AÇÕES ====================
  novoprofessor() {
    this.formulario.reset();
    this.modo = 'creating';
    this.originalprofessor = null;
    this.formulario.enable();
    // this.atualizarEstadoUI();
  }

  editar() {
    if (!this.Selecionado) return;

    this.modo = 'editing';
    this.formulario.patchValue(this.Selecionado);
    this.originalprofessor = { ...this.Selecionado };
    this.formulario.enable();
    this.atualizarEstadoUI();
  }

  private removerMascaras(valor: any): string {
    if (!valor) return '';
    return valor.toString().replace(/\D/g, '');
  }

  cancelar() {
    if (this.modo === 'creating') {
      this.fecharModal();
    } else if (this.modo === 'editing' && this.originalprofessor) {
      this.formulario.patchValue(this.originalprofessor);
      this.modo = 'initial';
      this.atualizarEstadoUI();
    }
  }

  fecharModal() {
    this.formulario.reset();
    this.modo = 'initial';
    this.originalprofessor = null;
    this.visivel = false;
    this.visivelChange.emit(false);
  }

  recarregarPaginaInteira() {
    window.location.reload();
  }

  private resetToInitialState() {
    this.modo = 'initial';
    this.originalprofessor = null;
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
    const professorFormatado: professor = {
      ...formValue,
      telefone: this.removerMascaras(formValue.telefone),
    };
    if (this.modo === 'creating') {
      this.salvarNovo(professorFormatado);
      this.fecharModal();
    } else {
      this.atualizar(professorFormatado);
    }
    this.modo = 'initial';
    this.atualizarEstadoUI();
  }

  private salvarNovo(professorFormatado: professor) {

    this.professService.salvar(professorFormatado).subscribe({
      next: () => this.finalizarComSucesso(),
      error: (err) => console.error('Erro ao salvar:', err)
    });
  }

  private atualizar(professorFormatado: professor) {
    if (!this.Selecionado) return;

    const atualizado: professor = { ...this.Selecionado, ...professorFormatado };

    this.professService.editar(atualizado).subscribe({
      next: (dados) => {
        this.finalizarComSucesso();
      },
      error: (err) => console.error('Erro ao atualizar:', err)
    });
  }

  apagar() {
    const respota = window.confirm('Deseja realmente apagar o selecionado?');
    if (respota) {
      if (!this.Selecionado?.matricula) return;

      this.professService.apagar(this.Selecionado).subscribe({
        next: () => { this.finalizarComSucesso(); },
        error: (err) => { this.finalizarComSucesso(); },
      });
      this.fecharModal();
    }

  }

  private finalizarComSucesso() {
    this.carregarProfessores();
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