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
import { AulaDoain } from '../../../domain/aula.model';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DatePickerModule } from 'primeng/datepicker';
import { AulaService } from '../../../service/aula.service';

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
  templateUrl: './aula-p.html',
  styleUrl: './aula-p.css'
})
export class AulaP implements OnChanges, OnInit {

  aula: AulaDoain[] = [];

  formulario!: FormGroup;

  tipoPagamento: any;

  private modo: 'initial' | 'creating' | 'editing' = 'creating';

  @Input() Selecionado: AulaDoain | null = null;
  @Output() visivelChange = new EventEmitter<boolean>();
  @Input() visivel = false;
  private fb = inject(FormBuilder);
  private aulaService = inject(AulaService);

  private originalprofessor: AulaDoain | null = null;

  ngOnInit() {
    this.initForm();
    // this.carregaraula();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visivel'] && !this.visivel) {
      this.resetToInitialState();
    }

    if (changes['Selecionado'] && this.Selecionado && this.formulario) {
      this.originalprofessor = { ...this.Selecionado };
      this.formulario.patchValue(this.Selecionado);
    }
  }

  private initForm(): void {
    this.formulario = this.fb.group({
      codigo: [{ value: '', disabled: true }, [Validators.required]],
      turma: [{ value: '', disabled: true }, [Validators.required]],
      data: [{ value: '', disabled: true }, [Validators.required]],
      presencas: [{ value: '', disabled: true }, [Validators.required]]
    });
  }
 
 carregarAula() {
    this.aulaService.listarTodos().subscribe({
      next: (dados) => {
        console.log('Dados recebidos:', dados);
        this.aula = dados || [];
      },
      error: (err) => {
        console.log(err);
      }
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
  novoprofessor() {
    this.modo = 'creating';
    this.formulario.reset();
    this.originalprofessor = null;
    this.atualizarEstadoUI();
  }

  editar() {
    if (!this.Selecionado) return;
    this.modo = 'editing';
    this.originalprofessor = { ...this.Selecionado };
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
    } else if (this.modo === 'editing' && this.originalprofessor) {
      this.formulario.patchValue(this.originalprofessor);
      this.modo = 'initial';
      this.atualizarEstadoUI();
    }
  }

  private finalizarComSucesso() {
    this.fecharModal();
    this.carregarAula();
  }

  fecharModal() {
    this.modo = 'initial';
    this.originalprofessor = null;
    this.formulario.reset();
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
    const aulaFormatado: AulaDoain = {
      ...formValue,
      telefone: this.removerMascaras(formValue.telefone),
    };
    alert("ola1");
    if (this.modo === 'creating') {
      alert("ola2");
      this.salvarNovo(aulaFormatado);
      this.fecharModal();
    } else {
      alert("ola3");
      this.atualizar(aulaFormatado);
    }
    this.modo = 'initial';
    this.atualizarEstadoUI();
  }

  private salvarNovo(aulaFormatado: AulaDoain) {

    this.aulaService.salvar(aulaFormatado).subscribe({
      next: () => this.finalizarComSucesso(),
      error: (err) => console.error('Erro ao salvar:', err)
    });
  }

  private atualizar(aulaFormatado: AulaDoain) {
    if (!this.Selecionado) return;

    const atualizado: AulaDoain = { ...this.Selecionado, ...aulaFormatado };

    this.aulaService.editar(atualizado).subscribe({
      next: (dados) => {
        console.log(dados);
        this.finalizarComSucesso();
      },
      error: (err) => console.error('Erro ao atualizar:', err)
    });
  }

  apagar() {
    if (!this.Selecionado?.codigo) return;

    this.aulaService.apagar(this.Selecionado).subscribe({
      next: () => { this.finalizarComSucesso(); },
      error: (err) => { this.finalizarComSucesso(); },
    });
  }

}