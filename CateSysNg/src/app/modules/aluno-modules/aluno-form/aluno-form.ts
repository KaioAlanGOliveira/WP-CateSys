import { Component, Input, Output, EventEmitter, inject, OnChanges, OnInit, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumber } from "primeng/inputnumber";
import { alunoDomain } from '../../../models/aluno.model';
import { AlunoService } from '../../../service/aluno.service';
import { Aluno } from '../aluno/aluno';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-aluno-form',
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
  templateUrl: './aluno-form.html',
  styleUrl: './aluno-form.css'
})
export class AlunoForm implements OnChanges, OnInit {

  aluno!: alunoDomain;

  formulario!: FormGroup;

  tipoPagamento: any;

  private modo: 'initial' | 'creating' | 'editing' = 'creating';

  @Input() Selecionado!: alunoDomain;
  @Output() visivelChange = new EventEmitter<boolean>();
  @Input() visivel = false;

  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private AlunoService = inject(AlunoService);

  private originalAluno: alunoDomain | null = null;

  ngOnInit() {
    this.initForm();
    this.calcularIdadeAtual();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visivel'] && !this.visivel) {
      this.resetToInitialState();
    }

    if (changes['Selecionado'] && this.Selecionado && this.formulario) {
      this.modo = 'initial';
      this.carregarAlunosFiltrados();
      this.atualizarEstadoUI();
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
    this.formulario.get('matricula')?.disable();
    this.originalAluno = { ...this.Selecionado };
    this.formulario.patchValue({
      ...this.Selecionado,
      dataNascimento: this.converterDataNascimento(this.Selecionado.dataNascimento)
    });
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

    const nascimento = this.converterDataNascimento(dataNascimento);

    if (!nascimento) {
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

  salvar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const formValue = this.formulario.getRawValue();

    if (formValue.dataNascimento) {
      const data = new Date(formValue.dataNascimento);
      formValue.dataNascimento = data.toLocaleDateString('sv-SE'); 
    }

    if (this.modo === 'creating') {
      this.salvarNovo(formValue);
      this.fecharModal();
    } else {
      this.alterar(formValue);
    }
    this.modo = 'initial';
  }

  private salvarNovo(formValue: alunoDomain) {

    this.AlunoService.salvar(formValue).subscribe({
      next: () => this.finalizarComSucesso(),
      error: (err) => { alert('Erro ao salvar a aluno. A aluno já existe.'); console.error('Erro ao salvar:', err); }
    });
  }

  private alterar(formValue: alunoDomain) {

    this.AlunoService.editar(formValue).subscribe({
      next: () => {
        this.finalizarComSucesso();
      },
      error: (err) => {
        console.error('Erro ao salvar:', err);
      }
    });
  }


  carregarAlunos() {
    this.AlunoService.listarTodos().subscribe({
      next: (dados) => this.aluno = dados,
      error: (err) => console.error('Erro ao buscar alunos:', err)
    });
  }

  carregarAlunosFiltrados() {
    const filtro = this.Selecionado;
    this.AlunoService.getEntity(filtro).subscribe({
      next: (dados) => {

        this.aluno = dados;
        this.formulario.patchValue({
          ...dados,
          dataNascimento: this.converterDataNascimento(dados.dataNascimento)
        });
        this.calcularIdadeAtual();
        this.cdr.detectChanges();
      },
      error: (err) => { console.error('Erro ao buscar alunos:', err) }
    });
  }

  private converterDataNascimento(dataNascimento: unknown): Date | null {
    if (!dataNascimento) {
      return null;
    }

    if (dataNascimento instanceof Date) {
      return Number.isNaN(dataNascimento.getTime()) ? null : dataNascimento;
    }

    if (typeof dataNascimento !== 'string') {
      return null;
    }

    const data = dataNascimento.slice(0, 10);

    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      const [ano, mes, dia] = data.split('-').map(Number);
      return new Date(ano, mes - 1, dia);
    }

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
      const [dia, mes, ano] = data.split('/').map(Number);
      return new Date(ano, mes - 1, dia);
    }

    const dataConvertida = new Date(dataNascimento);
    return Number.isNaN(dataConvertida.getTime()) ? null : dataConvertida;
  }

}