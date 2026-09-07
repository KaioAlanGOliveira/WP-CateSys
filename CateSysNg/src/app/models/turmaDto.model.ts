import { alunoDomain } from "./aluno.model";
import { TurmaDomain } from "./turma.model";

export class TurmaDto {
	turma!: TurmaDomain;
	alunos!: alunoDomain[];
}