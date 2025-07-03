import * as z from "zod";

export const formSchema = z.object({
	pacienteId: z.string().min(1, "Selecione um paciente"),
	profissionalId: z.string().min(1, "Selecione um profissional"),
	data: z.date({
		required_error: "Selecione uma data",
		invalid_type_error: "Data inválida",
	}),
	horaInicio: z.string().min(1, "Selecione o horário de início"),
	horaFim: z.string().min(1, "Selecione o horário de término"),
	tipo: z.enum(["CONSULTA", "RETORNO", "EXAME"]).optional(),
	observacoes: z.string().optional(),
});

export type FormData = z.infer<typeof formSchema>;