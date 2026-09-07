import { alunoDomain } from "./aluno.model";
import { TurmaDomain } from "./turma.model";
import { AulaDomain } from "./aula.model";
import { Presenca } from "./presenca.model";

export class AulaDto {
	turma!: TurmaDomain;
	alunos!: alunoDomain[];
	aula!: AulaDomain;
	presencas!: Presenca[];
}