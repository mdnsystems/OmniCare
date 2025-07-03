import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormData } from "./schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Calendar, MessageCircle, Loader2 } from "lucide-react";
import { useWhatsAppMessages } from "@/hooks/useWhatsAppMessages";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { usePacientes } from "@/hooks/useQueries";
import { useProfissionais } from "@/hooks/useProfissionais";
import { createAgendamento } from "@/services/agendamento.service";
import { Paciente } from "@/components/tables/types/paciente";
import { Profissional } from "@/components/tables/types/profissional";
import { TipoAgendamento } from "@/types/api";

export function NovoAgendamento() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { sendAgendamentoAndScheduleLembrete, isLoading } = useWhatsAppMessages();
  const [enviarWhatsApp, setEnviarWhatsApp] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Função para converter string de data para Date
  const parseDateFromParams = (dateString: string | null): Date | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			data: parseDateFromParams(searchParams.get("data")) || new Date(),
			horaInicio: searchParams.get("horaInicio") || new Date().toISOString().split("T")[1],
			horaFim: searchParams.get("horaFim") || new Date().toISOString().split("T")[1], 
			pacienteId: "",
			profissionalId: "",
			tipo: "CONSULTA",
			observacoes: "",
		},
	});

  // Usar hooks para buscar dados
  const { data: pacientes = [] } = usePacientes();
  const { data: profissionaisData } = useProfissionais();
  const profissionais = profissionaisData?.data || [];

  const onSubmit = async (data: FormData) => {
		try {
			setIsSubmitting(true);
			
			// Converter a data para o formato esperado pela API
			const dataParaAPI = {
				...data,
				data: data.data.toISOString().split("T")[0] + "T00:00:00",
				tipo: (data.tipo || "CONSULTA") as TipoAgendamento,
			};

			// Usar o serviço de agendamento configurado
			const agendamentoCriado = await createAgendamento(dataParaAPI);

			// Se o WhatsApp estiver habilitado, enviar mensagem
			if (enviarWhatsApp) {
				const paciente = pacientes.find((p: Paciente) => p.id === data.pacienteId);
				const profissional = profissionais.find((p: Profissional) => p.id === data.profissionalId);

				if (paciente && profissional) {
					await sendAgendamentoAndScheduleLembrete.mutateAsync({
						agendamentoId: agendamentoCriado.id,
						pacienteId: paciente.id,
						profissionalId: profissional.id,
						data: dataParaAPI.data,
						horaInicio: data.horaInicio,
						horaFim: data.horaFim,
						tipo: (data.tipo || "CONSULTA") as TipoAgendamento,
						paciente,
						profissional
					});
				}
			}

			navigate("/agendamentos");
		} catch (error) {
			console.error("Erro ao criar agendamento:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

 return (
		<Card className="p-4 h-full flex flex-col">
		  <div className="flex items-center gap-2">
				<div className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center bg-green-100 dark:bg-green-900/30 rounded-lg">
					<Calendar className="w-5 h-5 text-green-700 dark:text-green-400" />
				</div>
				<p className="text-xl font-bold">Novo Agendamento</p>
			</div>

			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1 flex flex-col">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
					<div className="space-y-2">
						<Label htmlFor="pacienteId">Paciente</Label>
						<Select
							onValueChange={(value) => form.setValue("pacienteId", value)}
							value={form.watch("pacienteId")}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Selecione um paciente" />
							</SelectTrigger>
							<SelectContent>
								{Array.isArray(pacientes) && pacientes.map((paciente) => (
									<SelectItem key={paciente.id} value={paciente.id}>
										{paciente.nome}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{form.formState.errors.pacienteId && (
							<p className="text-sm text-red-500">
								{form.formState.errors.pacienteId.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="profissionalId">Profissional</Label>
						<Select
							onValueChange={(value) => form.setValue("profissionalId", value)}
							value={form.watch("profissionalId")}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Selecione um profissional" />
							</SelectTrigger>
							<SelectContent>
								{Array.isArray(profissionais) && profissionais.map((profissional) => (
									<SelectItem key={profissional.id} value={profissional.id}>
										{profissional.nome} - {profissional.especialidade?.nome || 'Sem especialidade'}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{form.formState.errors.profissionalId && (
							<p className="text-sm text-red-500">
								{form.formState.errors.profissionalId.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="data">Data</Label>
					 <DatePicker
						className="w-full"
							date={form.watch("data")}
							onSelect={(date) => form.setValue("data", date || new Date())}
						/>
						{form.formState.errors.data && (
							<p className="text-sm text-red-500">
								{form.formState.errors.data.message}
							</p>
						)}
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="horaInicio">Horário Início</Label>
							<TimePicker
								time={form.watch("horaInicio")}
								onTimeChange={(time) => form.setValue("horaInicio", time)}
								placeholder="Horário de início"
							/>
							{form.formState.errors.horaInicio && (
								<p className="text-sm text-red-500">
									{form.formState.errors.horaInicio.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="horaFim">Horário Término</Label>
							<TimePicker
								time={form.watch("horaFim")}
								onTimeChange={(time) => form.setValue("horaFim", time)}
								placeholder="Horário de término"
							/>
							{form.formState.errors.horaFim && (
								<p className="text-sm text-red-500">
									{form.formState.errors.horaFim.message}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="tipo">Tipo de Atendimento</Label>
						<Select
							onValueChange={(value) => form.setValue("tipo", value as "CONSULTA" | "RETORNO" | "EXAME")}
							value={form.watch("tipo")}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Selecione o tipo" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="CONSULTA">Consulta</SelectItem>
								<SelectItem value="RETORNO">Retorno</SelectItem>
								<SelectItem value="EXAME">Exame</SelectItem>
							</SelectContent>
						</Select>
						{form.formState.errors.tipo && (
							<p className="text-sm text-red-500">
								{form.formState.errors.tipo.message}
							</p>
						)}
					</div>
				</div>

				<div className="space-y-2 flex-1">
					<Label htmlFor="observacoes">Observações</Label>
					<Textarea
						id="observacoes"
						{...form.register("observacoes")}
					 placeholder="Digite as observações do agendamento"
					 rows={8}
					 className="min-h-[200px] resize-none flex-1"
					/>
				</div>

				<Separator />

				{/* Seção de WhatsApp */}
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<MessageCircle className="h-5 w-5 text-green-600" />
						<h3 className="font-semibold text-lg">Comunicação WhatsApp</h3>
					</div>
					
					<div className="flex items-center space-x-2">
						<Checkbox
							id="enviarWhatsApp"
							checked={enviarWhatsApp}
							onCheckedChange={(checked) => setEnviarWhatsApp(checked as boolean)}
						/>
						<Label htmlFor="enviarWhatsApp" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
							Enviar confirmação via WhatsApp
						</Label>
					</div>
					
					{enviarWhatsApp && (
						<div className="text-sm text-muted-foreground space-y-1">
							<p>✅ Mensagem de confirmação será enviada imediatamente</p>
							<p>📅 Lembrete será enviado automaticamente um dia antes da consulta</p>
							<p>🔗 Link de confirmação será incluído no lembrete</p>
						</div>
					)}
				</div>

				<div className="flex justify-end gap-4 mt-auto">
					<Button
						type="button"
						variant="outline"
						onClick={() => navigate("/agendamentos")}
						disabled={isLoading || isSubmitting}
					>
						Cancelar
					</Button>
					<Button type="submit" disabled={isLoading || isSubmitting}>
						{isLoading || isSubmitting ? (
							<>
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								Salvando...
							</>
						) : (
							'Salvar'
						)}
					</Button>
				</div>
			</form>
		</Card>
	);
} 