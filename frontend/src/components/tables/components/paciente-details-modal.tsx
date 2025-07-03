import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Paciente } from "../types/paciente";
import { Calendar, MapPin, Phone, User, CreditCard, Stethoscope } from "lucide-react";
import { CopyableCell } from "./copyable-cell";
import { calcularIdade } from "@/lib/utils";

interface PacienteDetailsModalProps {
	paciente: Paciente | null;
	isOpen: boolean;
	onClose: () => void;
}

export function PacienteDetailsModal({ paciente, isOpen, onClose }: PacienteDetailsModalProps) {
	if (!paciente) return null;

	// Função para formatar data com validação
	const formatarData = (dataString: string) => {
		try {
			const data = new Date(dataString);
			if (isNaN(data.getTime())) {
				return "Data inválida";
			}
			return format(data, "dd/MM/yyyy", { locale: ptBR });
		} catch (error) {
			return "Data inválida";
		}
	};

	// Função para calcular idade com validação
	const calcularIdadeSegura = (dataString: string) => {
		try {
			const data = new Date(dataString);
			if (isNaN(data.getTime())) {
				return "Data inválida";
			}
			return calcularIdade(data);
		} catch (error) {
			return "Data inválida";
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-[80%] min-w-[40%] max-h-[90vh] flex flex-col">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold flex items-center gap-2">
						<User className="h-6 w-6" />
						{paciente.nome}
					</DialogTitle>
					<DialogDescription>
						Visualização detalhada dos dados do paciente incluindo informações pessoais, contato, endereço e convênio.
					</DialogDescription>
				</DialogHeader>

				<div className="w-full flex flex-col gap-6 overflow-y-auto flex-1">
					<div className="space-y-6">
						<div className="bg-muted rounded-md p-4">
							<h3 className="text-lg font-semibold flex items-center gap-2">
								<User className="h-5 w-5" />
								Informações Pessoais
							</h3>
							<div className="mt-2 grid grid-cols-2 gap-4">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Nome</p>
									<p className="text-sm">{paciente.nome}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Data de Nascimento</p>
									<p className="text-sm">{formatarData(paciente.dataNascimento)}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">CPF</p>
									<CopyableCell value={paciente.cpf} />
								</div>

								<div>
									<p className="text-sm font-medium text-muted-foreground">Idade</p>
									<p className="text-sm">{calcularIdadeSegura(paciente.dataNascimento)} ano(s)</p>
								</div>
								
							</div>
						</div>

						<div className="bg-muted rounded-md p-4">
							<h3 className="text-lg font-semibold flex items-center gap-2">
								<Phone className="h-5 w-5" />
								Contato
							</h3>
							<div className="mt-2 grid grid-cols-2 gap-4">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Telefone</p>
									<CopyableCell value={paciente.telefone} />
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Email</p>
									<CopyableCell value={paciente.email} />
								</div>
							</div>
						</div>

						<div className="bg-muted rounded-md p-4">
							<h3 className="text-lg font-semibold flex items-center gap-2">
								<MapPin className="h-5 w-5" />
								Endereço
							</h3>
							<div className="mt-2 grid grid-cols-2 gap-4">
								<div className="col-span-2">
									<p className="text-sm font-medium text-muted-foreground">Rua</p>
									<p className="text-sm">{paciente.endereco}, {paciente.numero}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Complemento</p>
									<p className="text-sm">{paciente.complemento || "Não informado"}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Bairro</p>
									<p className="text-sm">{paciente.bairro}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">CEP</p>
									<p className="text-sm">{paciente.cep}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Cidade</p>
									<p className="text-sm">{paciente.cidade}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Estado</p>
									<p className="text-sm">{paciente.estado}</p>
								</div>
							</div>
						</div>

						<div className="bg-muted rounded-md p-4">
							<h3 className="text-lg font-semibold flex items-center gap-2">
								<CreditCard className="h-5 w-5" />
								Convênio
							</h3>
							<div className="mt-2 grid grid-cols-2 gap-4">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Operadora</p>
									<p className="text-sm">{paciente.convenioNome || "Não informado"}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Número</p>
									<p className="text-sm">{paciente.convenioNumero || "Não informado"}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Plano</p>
									<p className="text-sm">{paciente.convenioPlano || "Não informado"}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Validade</p>
									<p className="text-sm">{paciente.convenioValidade ? formatarData(paciente.convenioValidade) : "Não informado"}</p>
								</div>
							</div>
						</div>

						{paciente.profissional && (
							<div className="bg-muted rounded-md p-4">
								<h3 className="text-lg font-semibold flex items-center gap-2">
									<Stethoscope className="h-5 w-5" />
									Profissional Responsável
								</h3>
								<div className="mt-2 grid grid-cols-2 gap-4">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Nome</p>
										<p className="text-sm">{paciente.profissional.nome}</p>
									</div>
									<div>
										<p className="text-sm font-medium text-muted-foreground">Especialidade</p>
										<p className="text-sm">{paciente.profissional.especialidade?.nome || "Não informado"}</p>
									</div>
									<div>
										<p className="text-sm font-medium text-muted-foreground">Registro</p>
										<p className="text-sm">{paciente.profissional.registro}</p>
									</div>
								</div>
							</div>
						)}

						<div className="bg-muted rounded-md p-4">
							<h3 className="text-lg font-semibold flex items-center gap-2">
								<Calendar className="h-5 w-5" />
								Informações de Cadastro
							</h3>
							<div className="mt-2">
								<p className="text-sm font-medium text-muted-foreground">Data de Cadastro</p>
								<p className="text-sm">{formatarData(paciente.createdAt)}</p>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
} 