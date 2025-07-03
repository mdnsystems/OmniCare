import { Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

interface EvolucaoPacienteChartProps {
	data: EvolucaoPaciente[];
}

// Dados temporários
interface EvolucaoPaciente {
	data: string;
	peso: number;
	altura: number;
	pressaoSistolica: number;
	pressaoDiastolica: number;
	imc?: number;
	observacoes?: string;
}

const evolucaoPacienteMock: EvolucaoPaciente[] = [
	{
		data: "2024-01-01",
		peso: 70,
		altura: 170,
		pressaoSistolica: 120,
		pressaoDiastolica: 80
	},
	{
		data: "2024-02-01",
		peso: 69,
		altura: 170,
		pressaoSistolica: 118,
		pressaoDiastolica: 78
	}
];

export function EvolucaoPacienteChart({ data }: EvolucaoPacienteChartProps) {
	const chartData = {
		labels: data.map((item) => new Date(item.data).toLocaleDateString('pt-BR')),
		datasets: [
			{
				label: 'Peso (kg)',
				data: data.map((item) => item.peso),
				borderColor: 'rgb(75, 192, 192)',
				backgroundColor: 'rgba(75, 192, 192, 0.2)',
				tension: 0.1,
				yAxisID: 'y',
			},
			{
				label: 'IMC',
				data: data.map((item) => item.imc),
				borderColor: 'rgb(255, 99, 132)',
				backgroundColor: 'rgba(255, 99, 132, 0.2)',
				tension: 0.1,
				yAxisID: 'y1',
			},
		],
	};

	const options = {
		responsive: true,
		interaction: {
			mode: 'index' as const,
			intersect: false,
		},
		plugins: {
			legend: {
				position: 'top' as const,
			},
			title: {
				display: true,
				text: 'Evolução do Paciente',
				font: {
					size: 16,
					weight: 'bold' as const,
				},
			},
			tooltip: {
				callbacks: {
					label: function(context: { dataset: { label?: string }, parsed: { y: number }, dataIndex: number }) {
						const label = context.dataset.label || '';
						const value = context.parsed.y;
						const index = context.dataIndex;
						const observacao = data[index].observacoes;
						
						if (label.includes('IMC')) {
							let classificacao = '';
							if (value < 18.5) classificacao = ' (Abaixo do peso)';
							else if (value < 25) classificacao = ' (Peso normal)';
							else if (value < 30) classificacao = ' (Sobrepeso)';
							else classificacao = ' (Obesidade)';
							
							return `${label}: ${value.toFixed(1)}${classificacao}\nObservação: ${observacao}`;
						}
						
						return `${label}: ${value.toFixed(1)} kg\nObservação: ${observacao}`;
					}
				}
			}
		},
		scales: {
			y: {
				type: 'linear' as const,
				display: true,
				position: 'left' as const,
				title: {
					display: true,
					text: 'Peso (kg)',
				},
				grid: {
					drawOnChartArea: false,
				},
			},
			y1: {
				type: 'linear' as const,
				display: true,
				position: 'right' as const,
				title: {
					display: true,
					text: 'IMC',
				},
				grid: {
					drawOnChartArea: false,
				},
				min: 15,
				max: 35,
			},
		},
	};

	return (
		<div className="space-y-4">
			<Line options={options} data={chartData} />
			<div className="flex justify-center gap-10 text-xs">
				<div className="flex items-center gap-2">
					<div className="w-4 h-4 rounded bg-red-200 border border-red-500"></div>
					<div className="flex flex-col">
						<span>IMC &lt; 18.5</span>
						<span className="text-muted-foreground">(Abaixo do peso)</span>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<div className="w-4 h-4 rounded bg-green-200 border border-green-500"></div>
					<div className="flex flex-col">
						<span>IMC 18.5-24.9</span>
						<span className="text-muted-foreground">(Peso normal)</span>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<div className="w-4 h-4 rounded bg-yellow-200 border border-yellow-500"></div>
					<div className="flex flex-col">
						<span>IMC 25-29.9</span>
						<span className="text-muted-foreground">(Sobrepeso)</span>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<div className="w-4 h-4 rounded bg-orange-200 border border-orange-500"></div>
					<div className="flex flex-col">
						<span>IMC &gt; 30</span>
						<span className="text-muted-foreground">(Obesidade)</span>
					</div>
				</div>
			</div>
		</div>
	);
} 