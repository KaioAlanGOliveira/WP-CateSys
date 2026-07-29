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
import { RadioButtonModule } from 'primeng/radiobutton';
import { DatePickerModule } from 'primeng/datepicker';

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
  templateUrl: './aluno-p.html',
  styleUrl: './aluno-p.css'
})
export class AlunoP implements OnChanges, OnInit {

  aluno: aluno[] = [];

  formulario!: FormGroup;

  tipoPagamento: any;

  private modo: 'initial' | 'creating' | 'editing' = 'creating';

  @Input() Selecionado: aluno | null = null;
  @Output() visivelChange = new EventEmitter<boolean>();
  @Input() visivel = false;
  private fb = inject(FormBuilder);
  private AlunoService = inject(AlunoService);

  private originalAluno: aluno | null = null;

  ngOnInit() {
    this.initForm();
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
      idade: [{ value: null, disabled: true }],
      status: [{ value: 1, disabled: true }, [Validators.required]]
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


  salvar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const formValue = this.formulario.getRawValue();
    const alunoFormatado: aluno = {
      ...formValue,
      telefone: this.removerMascaras(formValue.telefone),
      telefoneResponsavel: this.removerMascaras(formValue.telefoneResponsavel)
    };

    if (this.modo === 'creating') {
      this.salvarNovo(alunoFormatado);
      this.fecharModal();
    } else {
      // this.atualizarFiel(alunoFormatado);
    }
    this.modo = 'initial';
    this.atualizarEstadoUI();
  }

  private salvarNovo(alunoFormatado: aluno) {
    this.AlunoService.salvar(alunoFormatado).subscribe({
      next: () => this.finalizarComSucesso(),
      error: (err) => console.error('Erro ao salvar fiel:', err)
    });
  }

  //  private atualizarFiel(alunoFormatado: Aluno) {
  //     if (!this.fielSelecionado) return;

  //     const atualizado: Aluno = { ...this.fielSelecionado, ...alunoFormatado };

  //     this.fielService.editarFiel(atualizado).subscribe({
  //       next: (a) => {
  //                console.log(a);   
  //                this.finalizarComSucesso();  
  //       },
  //       error: (err) => console.error('Erro ao atualizar fiel:', err)
  //     });
  //   }

  apagar() {
    if (!this.Selecionado?.matricula) return;

    this.AlunoService.apagar(this.Selecionado).subscribe({
      next: () => { this.finalizarComSucesso(); },
      error: (err) => { this.finalizarComSucesso(); },
    });
  }

}