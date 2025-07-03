import { Card } from "@/components/ui/card";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { useState, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { Agendamento, Profissional } from "@/types/api";
import { EventClickArg } from '@fullcalendar/core';
import { Calendar, User, Clock, MapPin, Phone, Mail, X, Loader2, AlertCircle } from "lucide-react";
import { useAgendamentos } from "@/hooks/useQueries";
import { useProfissionais } from "@/hooks/useProfissionais";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function ListaAgendamentos() {
	const navigate = useNavigate();
	const { data: agendamentos = [], isLoading, error } = useAgendamentos();
	const { data: profissionaisData } = useProfissionais();
	const profissionais = profissionaisData?.data || [];
	
	const [selectedProfissional, setSelectedProfissional] = useState<string>("TODOS");
	const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const getEventColor = (tipo: string) => {
		switch (tipo) {
			case "CONSULTA":
				return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
			case "RETORNO":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800";
			case "EXAME":
				return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-800";
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "CONFIRMADO":
				return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800";
			case "AGENDADO":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
			case "CANCELADO":
				return "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300 border-red-200 dark:border-red-800";
			case "REALIZADO":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-800";
		}
	};

	// Filtrar agendamentos por profissional
	const filteredAgendamentos = useMemo(() => {
		if (selectedProfissional === "TODOS") {
			return agendamentos;
		}
		return agendamentos.filter((agendamento: Agendamento) => agendamento.profissionalId === selectedProfissional);
	}, [agendamentos, selectedProfissional]);

	// Converter agendamentos para eventos do calendário
	const events = useMemo(() => {
		if (!Array.isArray(filteredAgendamentos)) {
			return [];
		}
		
		if (filteredAgendamentos.length === 0) {
			return [];
		}
		
		return filteredAgendamentos.map((agendamento) => {
			// Garantir que a data está no formato correto
			let dataStr: string;
			
			if (typeof agendamento.data === 'string') {
				dataStr = agendamento.data;
			} else if (agendamento.data instanceof Date) {
				dataStr = agendamento.data.toISOString();
			} else {
				// Se for um objeto Date ou outro formato, tentar converter
				dataStr = new Date(agendamento.data).toISOString();
			}
			
			// Extrair apenas a parte da data (YYYY-MM-DD)
			const dataPart = dataStr.split('T')[0];
			
			// Garantir que os horários estão no formato correto (HH:MM)
			const horaInicio = agendamento.horaInicio.includes(':') ? agendamento.horaInicio : `${agendamento.horaInicio}:00`;
			const horaFim = agendamento.horaFim.includes(':') ? agendamento.horaFim : `${agendamento.horaFim}:00`;
			
			const startDate = `${dataPart}T${horaInicio}`;
			const endDate = `${dataPart}T${horaFim}`;
			
			// Obter cores baseadas no tipo
			const getEventBackgroundColor = (tipo: string) => {
				switch (tipo) {
					case "CONSULTA":
						return "#10b981"; // emerald-500
					case "RETORNO":
						return "#3b82f6"; // blue-500
					case "EXAME":
						return "#f97316"; // orange-500
					default:
						return "#6b7280"; // gray-500
				}
			};
			
			return {
				id: agendamento.id,
				title: `${agendamento.paciente?.nome || 'Paciente'} - ${agendamento.tipo}`,
				start: startDate,
				end: endDate,
				backgroundColor: getEventBackgroundColor(agendamento.tipo),
				borderColor: getEventBackgroundColor(agendamento.tipo),
				textColor: "#ffffff",
				extendedProps: {
					...agendamento,
				},
			};
		});
	}, [filteredAgendamentos]);

	const handleDateSelect = (selectInfo: { startStr: string; endStr: string }) => {
		const start = selectInfo.startStr;
		const end = selectInfo.endStr;
		navigate(`/agendamentos/novo?data=${start.split('T')[0]}&horaInicio=${start.split('T')[1]}&horaFim=${end.split('T')[1]}`);
	};

	const handleEventClick = (clickInfo: EventClickArg) => {
		const agendamento = clickInfo.event.extendedProps as Agendamento;
		setSelectedAgendamento(agendamento);
		setIsModalOpen(true);
	};

	const dayCellClassNames = (arg: { date: Date }) => {
		const today = new Date();
		const isToday = arg.date.toDateString() === today.toDateString();
		return isToday ? 'bg-muted' : '';
	};

	const calcularIdade = (dataNascimento: string) => {
		const hoje = new Date();
		const nascimento = new Date(dataNascimento);
		let idade = hoje.getFullYear() - nascimento.getFullYear();
		const mesAtual = hoje.getMonth();
		const mesNascimento = nascimento.getMonth();
		
		if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
			idade--;
		}
		
		return idade;
	};

	return (
		<Card className="p-4 h-full flex flex-col bg-background dark:bg-gray-900 border border-border dark:border-gray-700">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<div className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
						<Calendar className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
					</div>
					<p className="text-xl font-bold text-foreground dark:text-gray-100">Agendamentos</p>
				</div>
				
				{/* Filtro por Profissional */}
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium text-foreground dark:text-gray-100">Profissional:</span>
					<Select value={selectedProfissional} onValueChange={setSelectedProfissional}>
						<SelectTrigger className="w-48">
							<SelectValue placeholder="Selecione um profissional" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="TODOS">Todos os Profissionais</SelectItem>
							{profissionais.map((profissional: Profissional) => (
								<SelectItem key={profissional.id} value={profissional.id}>
									{profissional.nome}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
			
			{/* Loading State */}
			{isLoading && (
				<div className="flex items-center justify-center h-64">
					<div className="flex items-center gap-2">
						<Loader2 className="h-6 w-6 animate-spin" />
						<span className="text-foreground dark:text-gray-100">Carregando agendamentos...</span>
					</div>
				</div>
			)}
			
			{/* Error State */}
			{error && (
				<div className="mb-4 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg">
					<div className="flex items-center gap-2 text-red-800 dark:text-red-300">
						<AlertCircle className="h-4 w-4" />
						<span className="text-sm font-medium">Erro ao carregar agendamentos: {error.message}</span>
					</div>
				</div>
			)}
			
			{/* Calendar */}
			{!isLoading && !error && (
				<div className="calendar-container flex-1 [&_.fc-daygrid-day]:cursor-pointer [&_.fc-daygrid-day]:transition-colors [&_.fc-daygrid-day:hover]:bg-muted [&_.fc-timegrid-col]:cursor-pointer [&_.fc-timegrid-col]:transition-colors [&_.fc-timegrid-col:hover]:bg-muted [&_.fc-button]:!bg-muted/50 [&_.fc-button]:!border-border [&_.fc-button]:!text-foreground [&_.fc-button:hover]:!bg-muted/70 [&_.fc-button-active]:!bg-muted [&_.fc-button-active]:!border-border [&_.fc-button-active]:!text-foreground [&_.fc-button-active:hover]:!bg-muted/90 [&_.fc-button-group_.fc-button:first-child]:!rounded-l-md [&_.fc-button-group_.fc-button:last-child]:!rounded-r-md [&_.fc-button:not(.fc-button-group_*)]:!rounded-md">
					<FullCalendar
						plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
						initialView="dayGridMonth"
						headerToolbar={{
							left: 'prev,next today',
							center: 'title',
							right: 'dayGridMonth,timeGridWeek,timeGridDay'
						}}
						locale={ptBrLocale}
						events={events}
						editable={true}
						selectable={true}
						selectMirror={true}
						dayMaxEvents={true}
						weekends={true}
						height="100%"
						allDaySlot={false}
						slotMinTime="08:00:00"
						slotMaxTime="18:00:00"
						slotDuration="00:30:00"
						select={handleDateSelect}
						eventClick={handleEventClick}
						dayCellClassNames={dayCellClassNames}
					/>
				</div>
			)}

			{/* Modal de Detalhes do Agendamento */}
			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background dark:bg-gray-900 border border-border dark:border-gray-700">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2 text-foreground dark:text-gray-100">
							<Calendar className="h-5 w-5" />
							Detalhes do Agendamento
						</DialogTitle>
					</DialogHeader>
					
					{selectedAgendamento && (
						<div className="space-y-6">
							{/* Informações do Agendamento */}
							<div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
								<h3 className="font-semibold text-lg mb-3 text-foreground dark:text-gray-100">Informações da Consulta</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="flex items-center gap-3">
										<Calendar className="h-5 w-5 text-muted-foreground" />
										<div>
											<p className="font-medium text-foreground dark:text-gray-100">Data</p>
											<p className="text-sm text-muted-foreground">
												{format(parseISO(selectedAgendamento.data), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
											</p>
										</div>
									</div>
									
									<div className="flex items-center gap-3">
										<Clock className="h-5 w-5 text-muted-foreground" />
										<div>
											<p className="font-medium text-foreground dark:text-gray-100">Horário</p>
											<p className="text-sm text-muted-foreground">
												{selectedAgendamento.horaInicio} - {selectedAgendamento.horaFim}
											</p>
										</div>
									</div>
									
									<div className="flex items-center gap-3">
										<User className="h-5 w-5 text-muted-foreground" />
										<div>
											<p className="font-medium text-foreground dark:text-gray-100">Profissional</p>
											<p className="text-sm text-muted-foreground">
												{selectedAgendamento.profissional?.nome}
											</p>
										</div>
									</div>
									
									<div className="flex items-center gap-3">
										<MapPin className="h-5 w-5 text-muted-foreground" />
										<div>
											<p className="font-medium text-foreground dark:text-gray-100">Especialidade</p>
											<p className="text-sm text-muted-foreground">
												{selectedAgendamento.profissional?.especialidade?.nome || 'Não informada'}
											</p>
										</div>
									</div>
								</div>
								
								<div className="flex items-center gap-2 mt-4">
									<Badge className={getEventColor(selectedAgendamento.tipo)}>
										{selectedAgendamento.tipo}
									</Badge>
									<Badge className={getStatusColor(selectedAgendamento.status)}>
										{selectedAgendamento.status}
									</Badge>
								</div>
								
								{selectedAgendamento.observacoes && (
									<div className="mt-4">
										<p className="font-medium text-sm mb-1 text-foreground dark:text-gray-100">Observações</p>
										<p className="text-sm text-muted-foreground bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-2">
											{selectedAgendamento.observacoes}
										</p>
									</div>
								)}
							</div>

							{/* Informações do Paciente */}
							{selectedAgendamento.paciente && (
								<div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
									<h3 className="font-semibold text-lg mb-3 text-foreground dark:text-gray-100">Informações do Paciente</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<p className="font-medium text-foreground dark:text-gray-100">Nome</p>
											<p className="text-sm text-muted-foreground">{selectedAgendamento.paciente.nome}</p>
										</div>
										
										<div>
											<p className="font-medium text-foreground dark:text-gray-100">Idade</p>
											<p className="text-sm text-muted-foreground">
												{calcularIdade(selectedAgendamento.paciente.dataNascimento)} anos
											</p>
										</div>
										
										{selectedAgendamento.paciente.telefone && (
											<div className="flex items-center gap-2">
												<Phone className="h-4 w-4 text-muted-foreground" />
												<div>
													<p className="font-medium text-foreground dark:text-gray-100">Telefone</p>
													<p className="text-sm text-muted-foreground">{selectedAgendamento.paciente.telefone}</p>
												</div>
											</div>
										)}
										
										{selectedAgendamento.paciente.email && (
											<div className="flex items-center gap-2">
												<Mail className="h-4 w-4 text-muted-foreground" />
												<div>
													<p className="font-medium text-foreground dark:text-gray-100">Email</p>
													<p className="text-sm text-muted-foreground">{selectedAgendamento.paciente.email}</p>
												</div>
											</div>
										)}
									</div>
								</div>
							)}

							{/* Ações */}
							<div className="flex gap-2 justify-end">
								<Button
									variant="outline"
									onClick={() => setIsModalOpen(false)}
								>
									<X className="h-4 w-4 mr-2" />
									Fechar
								</Button>
								<Button
									onClick={() => {
										setIsModalOpen(false);
										navigate(`/agendamentos/${selectedAgendamento.id}`);
									}}
								>
									Ver Detalhes Completos
								</Button>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</Card>
	);
}