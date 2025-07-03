import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Profissional } from "../types/profissional";
import { Calendar, MapPin, Phone, User, Stethoscope, Clock, Badge } from "lucide-react";
import { CopyableCell } from "./copyable-cell";
import { Badge as BadgeComponent } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ProfissionalStatus } from "@/types/api";

interface ProfissionalDetailsModalProps {
	profissional: Profissional | null;
	isOpen: boolean;
	onClose: () => void;
}

export function ProfissionalDetailsModal({ profissional, isOpen, onClose }: ProfissionalDetailsModalProps) {
	if (!profissional) return null;

	// Função para formatar data com validação
	const formatarData = (dataString: string) => {
		try {
			const data = new Date(dataString);
			if (isNaN(data.getTime())) {
				return "Data inválida";
			}
			return format(data, "dd/MM/yyyy", { locale: ptBR });
		} catch {
			return "Data inválida";
		}
	};

	// Função para calcular idade com validação
	const calcularIdade = (dataString: string) => {
		try {
			const data = new Date(dataString);
			if (isNaN(data.getTime())) {
				return "Data inválida";
			}
			const hoje = new Date();
			const idade = hoje.getFullYear() - data.getFullYear();
			const mes = hoje.getMonth() - data.getMonth();
			if (mes < 0 || (mes === 0 && hoje.getDate() < data.getDate())) {
				return idade - 1;
			}
			return idade;
		} catch {
			return "Data inválida";
		}
	};

	// Função para obter cor do status
	const getStatusColor = (status: ProfissionalStatus) => {
		switch (status) {
			case ProfissionalStatus.ATIVO:
				return 'bg-lime-100 dark:bg-lime-900/30 dark:text-lime-400 text-lime-700 border-lime-200 dark:border-lime-800';
			case ProfissionalStatus.INATIVO:
				return 'bg-red-100 dark:bg-red-900/30 dark:text-red-400 text-red-700 border-red-200 dark:border-red-800';
			case ProfissionalStatus.FERIAS:
				return 'bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 text-blue-700 border-blue-200 dark:border-blue-800';
			case ProfissionalStatus.LICENCA:
				return 'bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 text-yellow-700 border-yellow-200 dark:border-yellow-800';
			default:
				return 'bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400 text-gray-700 border-gray-200 dark:border-gray-800';
		}
	};

	// Função para formatar dias de trabalho
	const formatarDiasTrabalho = (dias: string[]) => {
		const mapeamento: Record<string, string> = {
			'SEGUNDA': 'Segunda',
			'TERCA': 'Terça',
			'QUARTA': 'Quarta',
			'QUINTA': 'Quinta',
			'SEXTA': 'Sexta',
			'SABADO': 'Sábado',
			'DOMINGO': 'Domingo'
		};
		return dias.map(dia => mapeamento[dia] || dia).join(', ');
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-[80%] min-w-[40%] max-h-[90vh] flex flex-col">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold flex items-center gap-2">
						<Stethoscope className="h-6 w-6" />
						{profissional.nome}
						<BadgeComponent 
							variant="outline" 
							className={cn(
								"ml-2 flex items-center justify-center gap-1 px-3 py-1",
								getStatusColor(profissional.status)
							)}
						>
							{profissional.status}
						</BadgeComponent>
					</DialogTitle>
					<DialogDescription>
						Detalhes completos do profissional {profissional.nome}
					</DialogDescription>
				</DialogHeader>

				<div className="w-full flex flex-col gap-6 overflow-y-auto flex-1">
					<div className="space-y-6">
						{/* Informações Pessoais */}
						<div className="bg-muted rounded-md p-4">
							<h3 className="text-lg font-semibold flex items-center gap-2">
								<User className="h-5 w-5" />
								Informações Pessoais
							</h3>
							<div className="mt-2 grid grid-cols-2 gap-4">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Nome</p>
									<p className="text-sm">{profissional.nome}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Data de Nascimento</p>
									<p className="text-sm">{formatarData(profissional.dataNascimento)}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Idade</p>
									<p className="text-sm">{calcularIdade(profissional.dataNascimento)} ano(s)</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Sexo</p>
									<p className="text-sm">{profissional.sexo === 'M' ? 'Masculino' : 'Feminino'}</p>
								</div>
							</div>
						</div>

						{/* Informações Profissionais */}
						<div className="bg-muted rounded-md p-4">
							<h3 className="text-lg font-semibold flex items-center gap-2">
								<Badge className="h-5 w-5" />
								Informações Profissionais
							</h3>
							<div className="mt-2 grid grid-cols-2 gap-4">
								<div>
									<p className="text-sm font-medium text-muted-foreground">CRM</p>
									<CopyableCell value={profissional.crm} />
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Registro</p>
									<CopyableCell value={profissional.registro} />
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Especialidade</p>
									<p className="text-sm">{profissional.especialidade?.nome || "Não informado"}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Data de Contratação</p>
									<p className="text-sm">{formatarData(profissional.dataContratacao)}</p>
								</div>
							</div>
						</div>

						{/* Contato */}
						<div className="bg-muted rounded-md p-4">
							<h3 className="text-lg font-semibold flex items-center gap-2">
								<Phone className="h-5 w-5" />
								Contato
							</h3>
							<div className="mt-2 grid grid-cols-2 gap-4">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Telefone</p>
									<CopyableCell value={profissional.telefone} />
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Email</p>
									<CopyableCell value={profissional.email} />
								</div>
							</div>
						</div>

						{/* Endereço */}
						<div className="bg-muted rounded-md p-4">
							<h3 className="text-lg font-semibold flex items-center gap-2">
								<MapPin className="h-5 w-5" />
								Endereço
							</h3>
							<div className="mt-2 grid grid-cols-2 gap-4">
								<div className="col-span-2">
									<p className="text-sm font-medium text-muted-foreground">Rua</p>
									<p className="text-sm">{profissional.rua}, {profissional.numero}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Complemento</p>
									<p className="text-sm">{profissional.complemento || "Não informado"}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Bairro</p>
									<p className="text-sm">{profissional.bairro}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">CEP</p>
									<p className="text-sm">{profissional.cep}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Cidade</p>
									<p className="text-sm">{profissional.cidade}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Estado</p>
									<p className="text-sm">{profissional.estado}</p>
								</div>
							</div>
						</div>

						{/* Horários de Trabalho */}
						<div className="bg-muted rounded-md p-4">
							<h3 className="text-lg font-semibold flex items-center gap-2">
								<Clock className="h-5 w-5" />
								Horários de Trabalho
							</h3>
							<div className="mt-2 grid grid-cols-2 gap-4">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Horário</p>
									<p className="text-sm">{profissional.horarioInicio} - {profissional.horarioFim}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Intervalo</p>
									<p className="text-sm">{profissional.intervalo}</p>
								</div>
								<div className="col-span-2">
									<p className="text-sm font-medium text-muted-foreground">Dias de Trabalho</p>
									<p className="text-sm">{formatarDiasTrabalho(profissional.diasTrabalho)}</p>
								</div>
							</div>
						</div>

						{/* Informações de Cadastro */}
						<div className="bg-muted rounded-md p-4">
							<h3 className="text-lg font-semibold flex items-center gap-2">
								<Calendar className="h-5 w-5" />
								Informações de Cadastro
							</h3>
							<div className="mt-2">
								<p className="text-sm font-medium text-muted-foreground">Data de Cadastro</p>
								<p className="text-sm">{formatarData(profissional.createdAt)}</p>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
} 