import { Component, Input, Output, EventEmitter, inject, OnChanges, OnInit, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { TurmaService } from '../../../service/turma.service';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DatePickerModule } from 'primeng/datepicker';
import { TurmaDomain } from '../../../models/turma.model';
import { TurmaDto } from '../../../models/turmaDto.model';
import { aluno } from '../../../models/aluno.model';
import { AlunoService } from '../../../service/aluno.service';
import { TurmaAlunoService } from '../../../service/turmaAluno.service';
import { TableModule } from "primeng/table";
import { TurmaAluno } from '../../../models/TurmaAluno.model';
import { AulaDomain } from '../../../models/aula.model';
import { AulaService } from '../../../service/aula.service';
import { log } from 'console';
import { AulaDto } from '../../../models/aulaDto.model';
import { ComponenteTurma } from "../../../shared/componente/componente-pesq-turma/componente-turma";

@Component({
  selector: 'app-aula-form',
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
    TableModule,
    ComponenteTurma
],
  templateUrl: './aula-form.html',
  styleUrl: './aula-form.css'
})
export class AulaForm implements OnChanges, OnInit {


  get novoHabilitado() { return this.modo === 'initial'; }
  get alterarHabilitado() { return this.modo === 'initial' && !!this.Selecionado; }
  get apagarHabilitado() { return this.modo === 'initial' && !!this.Selecionado; }
  get salvarHabilitado() { return this.modo !== 'initial'; }
  get cancelarHabilitado() { return this.modo !== 'initial'; }
  get fecharHabilitado() { return true; }

  turmas: TurmaDomain[] = [];
  formulario!: FormGroup;
  tipoPagamento: any;
  formAlunos!: FormGroup;
  listTAluno: any[] = [];
  alunosFiltrados: any[] = [];
  alunoSelecionado!: any;
  tAlunosFiltrados: TurmaAluno[] = [];
  salvo = false
  disabled?: boolean;

  private modo: 'initial' | 'creating' | 'editing' = 'initial';

  private alunoServece = inject(AlunoService);
  private cdr = inject(ChangeDetectorRef);

  @Input() Selecionado: any | null = null;
  @Output() visivelChange = new EventEmitter<boolean>();
  @Input() visivel = false;

  private fb = inject(FormBuilder);
  private turmaService = inject(TurmaService);
  private turmaAlunoService = inject(TurmaAlunoService);
  private aulaService = inject(AulaService);

  private originalAula: TurmaDomain | null = null;
  turmasFiltradas: any;

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visivel'] && !this.visivel) {
      this.resetToInitialState();
    }

    if (changes['Selecionado'] && this.Selecionado && this.formulario) {
      
      this.modo = 'creating';
      this.carregarTurmaSelecionada();
      this.originalAula = { ...this.Selecionado };
      this.disabled = true;
    } else if (changes['visivel'] && this.visivel && !this.Selecionado && this.formulario) {
      this.disabled = false;
      this.modo = 'creating';
      this.formulario.reset();
    }

    this.alterarEstadoUI();
  }


  private initForm(): void {
    this.formulario = this.fb.group({
      codigo: [{ value: '', disabled: false }],
      data: [{ value: '', disabled: false }, [Validators.required]],
      turmaCodigo: [{ value: null, disabled: true }],
    });
  }

 

  // ==================== CONTROLE CENTRALIZADO ====================
  private alterarEstadoUI(): void {
    if (!this.formulario) return;

    if (this.modo === 'initial') {
      this.formulario.disable();
    } else if (this.modo === 'editing') {
      this.formulario.enable();
      this.disabled = false;
    } else {
      this.formulario.enable();
    }
  }


  // ==================== AÇÕES ====================
  novo() {
    this.modo = 'creating';
    this.originalAula = null;
    this.formulario.reset();
    this.formulario.markAllAsDirty();
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    this.formulario.enable();
    this.listTAluno = [];
    this.disabled = false;
    this.alterarEstadoUI();
  }

  editar() {
    if (!this.Selecionado) return;
    this.modo = 'editing';
    this.formulario.patchValue(this.Selecionado);
    this.originalAula = { ...this.Selecionado };
    this.formulario.enable();
    this.formulario.markAllAsDirty();
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    this.alterarEstadoUI();
  }

  private removerMascaras(valor: any): string {
    if (!valor) return '';
    return valor.toString().replace(/\D/g, '');
  }

  cancelar() {
    if (this.modo === 'creating') {
      this.formulario.reset();
      this.fecharModal();
    } else if (this.modo === 'editing' && this.originalAula) {
      this.formulario.patchValue(this.originalAula);
      this.disabled = true;
      this.modo = 'initial';
      this.alterarEstadoUI();
    }
  }

  fecharModal() {
    this.modo = 'initial';
    this.visivel = false;
    this.originalAula = null;
    this.visivelChange.emit(false);
    this.formulario.reset();
  }

  recarregarPaginaInteira() {
    window.location.reload();
  }

  private resetToInitialState() {
    this.modo = 'initial';
    this.originalAula = null;
    if (this.Selecionado) {
      this.formulario.patchValue(this.Selecionado);
    }
    this.alterarEstadoUI();
  }


  salvar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const formValue = this.formulario.getRawValue();

    const formTADto: AulaDto = {
      turma: formValue,
      alunos: this.listTAluno,
      aula: formValue,
    };

    if (this.modo === 'creating') {
      this.create(formTADto);
    } else {
      this.alterar(formTADto);
    }
  }

  private create(formTADto: AulaDto) {
    this.aulaService.salvar(formTADto).subscribe({
      next: (dados) => {
        alert('Aula criada com sucesso.');

        this.Selecionado = dados ?? formTADto.turma;
        this.originalAula = { ...this.Selecionado };
        this.disabled = true;
        this.finalizarComSucesso();
      },
      error: (err) => {
        console.error('Erro ao criar Aula:', err);
        alert('Erro ao criar a Aula.');
      }
    });
  }


  private alterar(formValue: TurmaDto) {
    if (!this.Selecionado) return;

    const atualizado: TurmaDto = { ...this.Selecionado, ...formValue };

    this.turmaService.editar(atualizado).subscribe({
      next: () => {
        alert('Turma atualizada com sucesso.');
        this.disabled = true;
        this.finalizarComSucesso();
      },
      error: (err) => console.error('Erro ao alterar:', err)
    });
  }

  apagar() {
    const respota = window.confirm('Deseja realmente apagar o elemento selecionado?');
    if (respota) {
      if (!this.Selecionado?.codigo) return;

      const formValue = this.formulario.getRawValue();

      const formTADto: TurmaDto = {
        turma: formValue,
        alunos: this.listTAluno
      };

      this.turmaService.apagar(formTADto).subscribe({
        next: () => { this.finalizarComSucesso(); this.fecharModal(); },
        error: (err) => { alert('Erro ao apagar a turma.'); this.finalizarComSucesso(); },
      });
    }
  }

  private finalizarComSucesso() {
    this.modo = 'initial';
    this.alterarEstadoUI();
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

  selecionado(aluno: aluno) {

    this.alunoSelecionado = aluno;
    this.visivel = true;
  }

  remover(): void {
    const index = this.listTAluno.indexOf(this.alunoSelecionado);
    if (index !== -1) {
      this.listTAluno.splice(index, 1);
    }
    this.alunoSelecionado = null;
  }

  add(aluno: aluno | null): void {
    if (!aluno) {
      alert('Nenhum aluno selecionado!');
      return;
    } else if (this.listTAluno.find(c => c.matricula == aluno)) {
      alert("Cliente já adicionado!");
      return;
    } else {

      const alunoPesquisa: aluno = {
        matricula: aluno
      } as aluno;

      this.alunoServece.listarTodosFiltrados(alunoPesquisa).subscribe({
        next: (dados) => {

          if (!dados || dados.length === 0) {
            alert('Aluno não encontrado.');
            return;
          }

          const alunoEncontrado = dados[0];

          this.listTAluno = [
            ...this.listTAluno,
            alunoEncontrado
          ];

          this.cdr.detectChanges();
          this.tAlunosFiltrados = [
            ...this.listTAluno
          ];

          this.alunoSelecionado = alunoEncontrado;
        },

        error: (err) => {
          console.error('Erro ao buscar aluno:', err);
          alert('Erro ao buscar o aluno.');
        }
      });
    }
  }
  private carregarTurmaSelecionada(): void {
    if (!this.Selecionado) {
      return;
    }

    const filtro: AulaDomain = {
      codigo: this.Selecionado.codigo
    } as TurmaDomain;
    
    console.log(filtro.codigo + "codigo");
    // carregar aula
    this.aulaService.listFiltrados(filtro).subscribe({
      next: (dados) => {        

        if (!dados || dados.length === 0) {
          alert('Aula não encontrada.');
          return;
        }

        const aula = dados[0];

        
        this.formulario.patchValue(aula);

        this.originalAula = { ...aula };

        //  carregar aluno

        this.aulaService.getListAT(aula.codigo).subscribe({
          next: (dados) => {

            this.listTAluno = dados.map((item: any) => ({
              matricula: item[0],
              nome: item[1],
              status: item[2]
            }));

            this.tAlunosFiltrados = [...this.listTAluno];

            console.log(this.tAlunosFiltrados);

            this.cdr.detectChanges();
          },

          error: (err) => {
            console.error(err);
          }
        });
      }
    })
  }


}
