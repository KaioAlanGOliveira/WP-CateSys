import { ChangeDetectorRef, Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { LoginService } from '../../../service/login.service';
import { AulaService } from '../../../service/aula.service';
import { TableModule } from 'primeng/table';
import { AulaDoain } from '../../../domain/aula.model';
import { log } from 'node:console';
import { AulaP } from '../aula-p/aula-p';
import { turma } from '../../../domain/turma.model';



@Component({
  selector: 'app-aula',
  imports: [ReactiveFormsModule, TableModule, AulaP],
  standalone: true,
  templateUrl: './aula.html',
  styleUrl: './aula.css',
})

export class Aula implements OnInit {


  private aulaServece = inject(AulaService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  exibirModalPrincipal: boolean = false;
  aulaSelecionado!: any;
  formaula!: AulaDoain;
  listaulas: AulaDoain[] = [];
  aulasFiltrados: any[] = [];

  alterar: boolean = false;
  form = new FormGroup({
    codigo: new FormControl<number | null>(null),
    turma: new FormControl<turma | "">("", Validators.required),
    data: new FormControl<Date | "">("", Validators.required),
    presencas: new FormControl<number | null>(null),
  });

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    const filtro = this.form.value as AulaDoain;
    this.aulaServece.listFiltrados(filtro).subscribe({
      next: (dados) => {

        this.listaulas = dados || [];
        this.aulasFiltrados = dados || [];
        console.log('Dados recebidos:', dados);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  novoPagamento() {
    this.alterar = false;
    this.exibirModalPrincipal = true;
    this.abrirMeuPopup();
  }
  pesquisar(termoNome: string, termoMatricula: string) {

    if (!termoNome && !termoMatricula) {
      this.aulasFiltrados = [...this.listaulas];
      return;
    }
    this.form.patchValue({
      //nome: termoNome,
      //matricula: termoMatricula ? Number(termoMatricula) : null
    });
    this.carregarDados();
  }
  abrirMeuPopup() {
    this.exibirModalPrincipal = true;
    this.alterar = true;
  }
  add() {
    this.alterar = false;
    this.form.reset();
    this.abrirMeuPopup();
  }
  retornoPopUp(exib: boolean) {

    if (!exib) {
      this.carregarDados();
    }
  }
  selecionado(aula: AulaDoain) {
    this.alterar = true;
    this.aulaSelecionado = aula;
    this.form.patchValue(aula);
    this.abrirMeuPopup();
  }
}
