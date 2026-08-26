import { aluno } from "./aluno.model";
import { TurmaDomain } from "./turma.model";

export class AulaDto {
	turma!: TurmaDomain;
	alunos!: aluno[];
}