import { aluno } from "./aluno.model";
import { TurmaDomain } from "./turma.model";

export class TurmaDto {
	turma!: TurmaDomain;
	alunos!: aluno[];
}