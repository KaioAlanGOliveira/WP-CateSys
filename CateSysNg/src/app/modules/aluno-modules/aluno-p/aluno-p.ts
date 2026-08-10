import { Component, Input, Output, EventEmitter, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumber } from "primeng/inputnumber";
import { AlunoD } from '../../../models/aluno.model';
import { AlunoService } from '../../../service/aluno.service';
import { Aluno } from '../aluno/aluno';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-aluno-p',
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
    InputNumber
],
  templateUrl: './aluno-p.html',
  styleUrl: './aluno-p.css'
})
export class AlunoP implements OnChanges, OnInit {

  salvar() {
    throw new Error('Method not implemented.');
  }

  aluno: AlunoD[] = [];

  formulario!: FormGroup;

  tipoPagamento: any;

  private modo: 'initial' | 'creating' | 'editing' = 'creating';

  @Input() Selecionado: AlunoD | null = null;
  @Output() visivelChange = new EventEmitter<boolean>();
  @Input() visivel = false;
  private fb = inject(FormBuilder);
  private AlunoService = inject(AlunoService);

  private originalAluno: AlunoD | null = null;

  ngOnInit() {
    this.initForm();
    this.calcularIdadeAtual();
    // this.carregarAlunos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visivel'] && !this.visivel) {
      this.resetToInitialState();
    }

    if (changes['Selecionado'] && this.Selecionado && this.formulario) {
      this.originalAluno = { ...this.Selecionado };
      this.formulario.patchValue(this.Selecionado);
    }
  }

  private initForm(): void {
    this.formulario = this.fb.group({
      matricula: [{ value: '', disabled: true }, [Validators.required]],
      nome: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3)]],
      telefone: [{ value: '', disabled: true }],
      nomeResponsavel: [{ value: '', disabled: true }, [Validators.required]],
      telefoneResponsavel: [{ value: '', disabled: true }],
      dataNascimento: [{ value: null, disabled: true }, [Validators.required]],
      idadeAtual: [{ value: null, disabled: true }],
      status: [{ value: 1, disabled: true }, [Validators.required]]
    });

    this.formulario.get('dataNascimento')?.valueChanges.subscribe(() => {
      this.calcularIdadeAtual();
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
    if (!this.formulario) return;
    const isInitial = this.modo === 'initial';

    if (isInitial) {
      this.formulario.disable();
    } else {
      this.formulario.enable();
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
    this.formulario.reset();
    this.originalAluno = null;
    this.atualizarEstadoUI();
  }

  editar() {
    if (!this.Selecionado) return;
    this.modo = 'editing';
    this.originalAluno = { ...this.Selecionado };
    this.formulario.patchValue(this.Selecionado);
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
      this.formulario.patchValue(this.originalAluno);
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
    this.formulario.reset();
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
      this.formulario.patchValue(this.Selecionado);
    }
    this.atualizarEstadoUI();
  }

  apagar() {
    if (!this.Selecionado?.matricula) return;

    this.AlunoService.apagar(this.Selecionado).subscribe({
      next: () => { this.finalizarComSucesso(); },
      error: (err) => { this.finalizarComSucesso(); },
    });
  }

  calcularIdadeAtual() {

    const dataNascimento = this.formulario.get('dataNascimento')?.value;
    if (dataNascimento) {
      const idade = this.calcularIdade(dataNascimento);
      this.formulario.get('idadeAtual')?.setValue(idade);
    } else {
      this.formulario.get('idadeAtual')?.setValue(null);
    }
  }

  private calcularIdade(dataNascimento: any): number | null {
    if (!dataNascimento) {
      return null;
    }

    const nascimento = dataNascimento instanceof Date ? dataNascimento : new Date(dataNascimento);
    if (Number.isNaN(nascimento.getTime())) {
      return null;
    }

    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesDiff = hoje.getMonth() - nascimento.getMonth();

    if (mesDiff < 0 || (mesDiff === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }

    return idade;
  }

}