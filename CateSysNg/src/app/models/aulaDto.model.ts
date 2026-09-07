import { aluno } from "./aluno.model";
import { TurmaDomain } from "./turma.model";
import { AulaDoain } from "./aula.model";
import { Presenca } from "./presenca.model";

export class AulaDto {
	turma!: TurmaDomain;
	alunos!: aluno[];
	aula!: AulaDoain;
	presencas!: Presenca[];
}