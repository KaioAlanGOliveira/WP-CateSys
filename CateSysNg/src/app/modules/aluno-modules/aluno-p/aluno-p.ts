import { Component, Input, Output, EventEmitter, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumber } from "primeng/inputnumber";
import { aluno } from '../../../domain/aluno.model';
import { AlunoService } from '../../../service/aluno.service';
import { Aluno } from '../aluno/aluno';

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
  ],
  templateUrl: './aluno-p.html',
  styleUrl: './aluno-p.css'
})
export class AlunoP implements OnChanges, OnInit {

  aluno: aluno[] = [];

  formularioAluno!: FormGroup;

  tipoPagamento: any;

  private modo: 'initial' | 'creating' | 'editing' = 'initial';

  @Input() Selecionado: aluno | null = null;
  @Output() visivelChange = new EventEmitter<boolean>();
  @Input() visivel = false;
  @Input() cmpAtivo = false;
  @Input() alterar = false;
  private fb = inject(FormBuilder);
  private AlunoService = inject(AlunoService);

  private originalAluno: aluno | null = null;

  ngOnInit() {
    this.initForm();
    this.carregarAlunos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visivel'] && !this.visivel) {
      this.resetToInitialState();
    }

    if (changes['Selecionado'] && this.Selecionado && this.formularioAluno) {
      this.originalAluno = { ...this.Selecionado };
      this.formularioAluno.patchValue(this.Selecionado);
    }
  }

  private initForm(): void {
    this.formularioAluno = this.fb.group({
      matricula: [{ value: '', disabled: true }, [Validators.required]],
      nome: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3)]],
      telefone: [{ value: '', disabled: true }],
      nomeResponsavel: [{ value: '', disabled: true }, [Validators.required]],
      telefoneResponsavel: [{ value: '', disabled: true }],
      dataNascimento: [{ value: null, disabled: true }, [Validators.required]],
      idade: [{ value: null, disabled: true }],
      tipo: [{ value: 1, disabled: true }, [Validators.required]]
    });
  }

  carregarAlunos() {
    this.AlunoService.listarTodos().subscribe({
      next: (dados) => this.aluno = dados || [],
      error: (err) => console.error('Erro ao buscar alunos:', err)
    });
  }

  // ==================== CONTROLE CENTRALIZADO ====================
  private atualizarEstadoUI(): void {
    if (!this.formularioAluno) return;
    const isInitial = this.modo === 'initial';

    if (isInitial) {
      this.formularioAluno.disable();
    } else {
      this.formularioAluno.enable();
      if (this.modo === 'editing') {
        this.formularioAluno.get('cpf')?.disable();
      }
    }
  }

  get novoHabilitado() { return this.modo === 'initial'; }
  get alterarHabilitado() { return this.modo === 'initial' && !!this.Selecionado; }
  get apagarHabilitado() { return this.modo === 'initial' && !!this.Selecionado; }
  get fecharHabilitado() { return this.modo === 'initial'; }
  get salvarHabilitado() { return this.modo !== 'initial'; }
  get cancelarHabilitado() { return this.modo !== 'initial'; }

  // ==================== AÇÕES ====================
  novoAluno() {
    this.modo = 'creating';
    this.formularioAluno.reset();
    this.originalAluno = null;
    this.atualizarEstadoUI();
  }

  editar() {
    if (!this.Selecionado) return;
    this.modo = 'editing';
    this.originalAluno = { ...this.Selecionado };
    this.formularioAluno.patchValue(this.Selecionado);
    this.atualizarEstadoUI();
  }

  private removerMascaras(valor: any): string {
    if (!valor) return '';
    return valor.toString().replace(/\D/g, '');
  }



  cancelar() {
    if (this.modo === 'creating') {
      this.fecharModal();
    } else if (this.modo === 'editing' && this.originalAluno) {
      this.formularioAluno.patchValue(this.originalAluno);
      this.modo = 'initial';
      this.atualizarEstadoUI();
    }
  }

  private finalizarComSucesso() {
    this.fecharModal();
    this.carregarAlunos();
  }

  fecharModal() {
    this.modo = 'initial';
    this.originalAluno = null;
    this.formularioAluno.reset();
    this.visivel = false;
    this.visivelChange.emit(false);
  }

  recarregarPaginaInteira() {
    window.location.reload();
  }

  private resetToInitialState() {
    this.modo = 'initial';
    this.originalAluno = null;
    if (this.Selecionado) {
      this.formularioAluno.patchValue(this.Selecionado);
    }
    this.atualizarEstadoUI();
  }



}