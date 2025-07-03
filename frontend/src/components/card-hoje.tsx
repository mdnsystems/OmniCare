import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, Stethoscope, IdCard, ChevronRight, BadgeCheckIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAgendamento } from "@/hooks/useAgendamento";
import { format, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn, calcularIdade } from "@/lib/utils";
import { StatusAgendamento } from "@/types/api";

interface CardHojeProps {
	date: Date | null;
	professionalId?: string;
}

export default function CardHoje({ date, professionalId }: CardHojeProps) {
	const { listByDate } = useAgendamento();
	
	const { data: agendamentos, isLoading, error } = listByDate(date, professionalId)	

	const getStatusColor = (status: StatusAgendamento) => {
		switch (status) {
			case 'CONFIRMADO':
				return 'bg-lime-100 dark:bg-lime-900/30 dark:text-lime-400 text-lime-700 border-lime-200 dark:border-lime-800';
			
			case 'AGENDADO':
				return 'bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 text-blue-700 border-blue-200 dark:border-blue-800';
			case 'CANCELADO':
				return 'bg-red-100 dark:bg-red-900/30 dark:text-red-400 text-red-700 border-red-200 dark:border-red-800';
			case 'REALIZADO':
				return 'bg-green-100 dark:bg-green-900/30 dark:text-green-400 text-green-700 border-green-200 dark:border-green-800';
			default:
				return 'bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400 text-gray-700 border-gray-200 dark:border-gray-800';
		}
	};

	if (isLoading) {
		return (
			<div className="flex flex-col justify-center items-center gap-4 h-full">
				<Card className="flex flex-col justify-between w-full">
					<CardHeader>
						<CardTitle className="text-xl font-bold">Consultas de Hoje</CardTitle>
					</CardHeader>
					<Card className="bg-muted/50">
						<CardContent className="flex w-full justify-between p-4">
							<Skeleton className="h-20 w-full" />
						</CardContent>
					</Card>
				</Card>
			</div>
		);
	}

	if (error) {
		return (
			<div className="w-full flex flex-col justify-start items-center gap-4 h-full">
				<Card className="w-full bg-muted/50">
					<CardContent className="flex w-full justify-center p-6">
						<p className="text-red-600">Erro ao carregar agendamentos: {error.message}</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Garantir que agendamentos seja um array
	const agendamentosArray = Array.isArray(agendamentos) ? agendamentos : [];

	return (
		<div className="w-full h-full flex flex-col">
			{agendamentosArray.length === 0 ? (
				<div className="flex-1 flex items-center justify-center">
					<Card className="w-full bg-muted/50">
						<CardContent className="flex w-full justify-center p-6">
							<p className="text-gray-500">Nenhuma consulta agendada para esta data</p>
						</CardContent>
					</Card>
				</div>
			) : (
				<div className="flex-1 overflow-y-auto space-y-4 pr-2">
					{agendamentosArray.map((agendamento) => (
						<Card 
							key={agendamento.id} 
							className="w-full bg-muted/50 hover:bg-muted/70 p-0 group"
						>
							<CardContent className="flex w-full justify-between p-6">
								<div className="flex flex-col gap-3">
									<div className="flex items-center gap-3">
										<div className="p-2 bg-primary/10 rounded-full">
											<User className="h-5 w-5 text-primary" />
										</div>
										<div className="flex flex-col">
											<p className="text-sm font-semibold tracking-tight">{agendamento.paciente?.nome} - {calcularIdade(agendamento.paciente?.dataNascimento || "")} anos</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<div className="p-2 bg-primary/10 rounded-full">
											<IdCard className="h-5 w-5 text-primary" />
										</div>
										<div className="flex flex-col">
											<p className="text-sm font-medium text-muted-foreground">Plano de Saúde</p>
											<p className="text-sm">{agendamento.paciente?.convenio?.nome} - {agendamento.paciente?.convenio?.plano}</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<div className="p-2 bg-primary/10 rounded-full">
											<Stethoscope className="h-5 w-5 text-primary" />
										</div>
										<div className="flex flex-col">
											<p className="text-sm font-medium text-muted-foreground">Profissional</p>
											<p className="text-sm">{agendamento.profissional?.nome}</p>
											<p className="text-xs text-muted-foreground">{agendamento.profissional?.especialidade?.nome}</p>
										</div>
									</div>
								</div>
								<div className="flex flex-col gap-3 items-end justify-between">
									<div className="flex flex-col gap-2 items-end">
										<Badge variant="outline" className="flex items-center gap-2 bg-background">
											<Clock className="h-4 w-4 text-muted-foreground" />
											<p className="font-medium">{format(parseISO(agendamento.data), 'HH:mm')}</p>
										</Badge>
										<Badge 
											variant="outline" 
											className={cn(
												"flex items-center justify-center gap-1 px-3 py-1",
												getStatusColor(agendamento.status)
											)}
										>
											{agendamento.status === 'REALIZADO' ? <BadgeCheckIcon className="h-4 w-4 text-green-700 dark:text-green-400" /> : ''}
											{agendamento.status}
										</Badge>
									</div>
									<Button 
										variant="ghost" 
										size="sm" 
										className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
									>
										Ver detalhes
										<ChevronRight className="h-4 w-4 ml-1" />
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}