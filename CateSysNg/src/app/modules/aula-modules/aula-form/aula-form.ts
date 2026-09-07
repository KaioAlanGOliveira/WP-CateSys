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
import { alunoDomain } from '../../../models/aluno.model';
import { AlunoService } from '../../../service/aluno.service';
import { TurmaAlunoService } from '../../../service/turmaAluno.service';
import { TableModule } from "primeng/table";
import { ComponenteAluno } from "../../../shared/componente/componente-pesq-aluno/componente-aluno";
import { ComponenteProfessor } from '../../../shared/componente/componente-pesq-professor/componente-professor';
import { TurmaAluno } from '../../../models/TurmaAluno.model';
import { AulaDomain } from '../../../models/aula.model';
import { AulaService } from '../../../service/aula.service';
import { log } from 'console';
import { AulaDto } from '../../../models/aulaDto.model';
import { Presenca } from '../../../models/presenca.model';
import { CheckboxModule } from 'primeng/checkbox';

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
    CheckboxModule,
    ComponenteProfessor
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
  alunos: alunoDomain[] = [];
  presencas: Presenca[] = [];
  alunosFiltrados: any[] = [];
  alunoSelecionado!: any;
  tAlunosFiltrados: TurmaAluno[] = [];
  salvo = false
  disabled?: boolean;

  private modo: 'initial' | 'creating' | 'editing' = 'initial';

  private alunoServece = inject(AlunoService);
  private cdr = inject(ChangeDetectorRef);

  @Input() Selecionado: AulaDomain | null = null;
  @Output() visivelChange = new EventEmitter<boolean>();
  @Input() visivel = false;

  private fb = inject(FormBuilder);
  private turmaService = inject(TurmaService);
  private turmaAlunoService = inject(TurmaAlunoService);
  private aulaService = inject(AulaService);

  private originalTurma: TurmaDomain | null = null;
  turmasFiltradas: any;

  ngOnInit() {
    this.initForm();
    if (this.Selecionado) {
      this.modo = 'initial';
      this.carregarSelecionado();
      this.disabled = true;
    }

    this.alterarEstadoUI();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visivel'] && !this.visivel) {
      this.resetToInitialState();
    }

    if (changes['Selecionado'] && this.Selecionado && this.formulario) {
      this.modo = 'initial';
      this.carregarSelecionado();
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
      nome: [{ value: '', disabled: true }, [Validators.required]],
      date: [{ value: '', disabled: false }, [Validators.required]],
      codAluno: [{ value: null, disabled: true }],
      professorMatricula: [{ value: null }],
      aluno: [{ value: 1, disabled: true }],
      presencas: this.fb.array([]),
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
    this.originalTurma = null;
    this.formulario.reset();
    this.alunos = [];
    this.presencas = [];
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
    } else if (this.modo === 'editing' && this.originalTurma) {
      this.formulario.patchValue(this.originalTurma);
      this.disabled = true;
      this.modo = 'initial';
      this.alterarEstadoUI();
    }
  }

  fecharModal() {
    this.modo = 'initial';
    this.visivel = false;
    this.originalTurma = null;
    this.visivelChange.emit(false);
    this.formulario.reset();
  }

  recarregarPaginaInteira() {
    window.location.reload();
  }

  private resetToInitialState() {
    this.modo = 'initial';
    this.originalTurma = null;
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
      alunos: this.alunos,
      aula: formValue,
      presencas: this.presencas.map((presenca) => ({
        id: {
          alunoMatricula: presenca.id.alunoMatricula,
          aulaCodigo: presenca.id.aulaCodigo ?? formValue.codigo
        },
        presente: presenca.presente ? 1 : 0
      }))
    };

    if (this.modo === 'creating') {
      this.create(formTADto);
    } else {
      this.alterar(formTADto);
    }
  }

  private create(formTADto: AulaDto) {
    this.turmaService.salvar(formTADto).subscribe({
      next: (dados) => {
        alert('Aula criada com sucesso.');

        this.Selecionado = dados ?? formTADto.turma;
        this.originalTurma = { ...this.Selecionado };
        this.disabled = true;
        this.finalizarComSucesso();
      },
      error: (err) => {
        console.error('Erro ao criar Aula:', err);
        alert('Erro ao criar a Aula.');
      }
    });
  }


  private alterar(formValue: AulaDto) {
    alert('Alterar aula');

    if (!this.Selecionado) return;

    const atualizado: AulaDto = { ...this.Selecionado, ...formValue };

    this.aulaService.editar(atualizado).subscribe({
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

      const formTADto: AulaDto = {
        turma: formValue,
        alunos: this.alunos,
        aula: formValue,
        presencas: this.presencas.map((presenca) => ({
          id: {
            alunoMatricula: presenca.id.alunoMatricula,
            aulaCodigo: presenca.id.aulaCodigo ?? formValue.codigo
          },
          presente: presenca.presente ? 1 : 0
        }))
      };

      this.aulaService.apagar(formTADto).subscribe({
        next: () => { this.finalizarComSucesso(); this.fecharModal(); },
        error: (err) => { alert('Erro ao apagar a aula.'); this.finalizarComSucesso(); },
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

  remover(): void {
    const index = this.listTAluno.indexOf(this.alunoSelecionado);
    if (index !== -1) {
      this.listTAluno.splice(index, 1);
    }
    this.alunoSelecionado = null;
  }

  add(aluno: alunoDomain | null): void {
    if (!aluno) {
      alert('Nenhum aluno selecionado!');
      return;
    } else if (this.listTAluno.find(c => c.matricula == aluno)) {
      alert("Cliente já adicionado!");
      return;
    } else {

      const alunoPesquisa: alunoDomain = {
        matricula: aluno
      } as alunoDomain;

      this.alunoServece.listarTodosFiltrados(alunoPesquisa).subscribe({
        next: (dados) => {

          if (!dados) {
            alert('Aluno não encontrado.');
            return;
          }

          const alunoEncontrado = dados;

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

  private carregarSelecionado(): void {
    if (!this.Selecionado) return;

    const codigo = this.Selecionado.turmaCodigo;

    if (!codigo) return;
    console.log(codigo);


    this.aulaService.getEntity(codigo).subscribe({
      next: (dados) => {

        // Preenche os campos do formulário
        this.formulario.patchValue({
          codigo: dados.aula?.codigo,
          date: dados.aula?.data,
          nome: dados.turma?.nome,
          professorMatricula: dados.turma?.professorMatricula
        });

        this.alunos = dados.alunos ?? [];
        this.presencas = dados.presencas ?? [];

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Erro ao carregar aula:', err);
      }
    });
  }

  selecionado(aluno: alunoDomain): boolean {
    const presenca = this.presencas.find(
      p => p.id.alunoMatricula === aluno.matricula
    );

    return Boolean(presenca?.presente);
  }

  alterarPresenca(aluno: alunoDomain, presente: boolean): void {
    let presenca = this.presencas.find(
      p => p.id.alunoMatricula === aluno.matricula
    );

    if (presenca) {
      presenca.presente = presente ? 1 : 0;
    } else {
      this.presencas.push({
        id: {
          alunoMatricula: aluno.matricula!,
          aulaCodigo: this.formulario.getRawValue().codigo
        },
        presente: presente ? 1 : 0
      });
    }
  }
}
