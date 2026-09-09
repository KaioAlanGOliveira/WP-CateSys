
import { TurmaDomain } from './turma.model';

export class AulaDomain {
	codigo?: number;
	turmaCodigo?: number;
	turma?: TurmaDomain;
	turmaNome?: string;
	data?: Date;
}