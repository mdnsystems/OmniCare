import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart,
} from "recharts"

interface EvolucaoSemanalData {
  dia: string
  agendamentos: number
  realizados: number
  receita: number
  prontuarios: number
}

interface EvolucaoSemanalChartProps {
  data?: EvolucaoSemanalData[]
  tipo?: 'line' | 'bar' | 'area'
  altura?: number
}

// Dados de exemplo para demonstração
const dadosExemplo: EvolucaoSemanalData[] = [
  { dia: "Seg", agendamentos: 12, realizados: 10, receita: 1200, prontuarios: 8 },
  { dia: "Ter", agendamentos: 15, realizados: 13, receita: 1500, prontuarios: 10 },
  { dia: "Qua", agendamentos: 18, realizados: 16, receita: 1800, prontuarios: 12 },
  { dia: "Qui", agendamentos: 14, realizados: 12, receita: 1400, prontuarios: 9 },
  { dia: "Sex", agendamentos: 20, realizados: 18, receita: 2000, prontuarios: 15 },
  { dia: "Sáb", agendamentos: 8, realizados: 7, receita: 800, prontuarios: 5 },
  { dia: "Dom", agendamentos: 5, realizados: 4, receita: 500, prontuarios: 3 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value}
            {entry.name === 'receita' && ' R$'}
            {entry.name === 'agendamentos' || entry.name === 'realizados' || entry.name === 'prontuarios' && ''}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function EvolucaoSemanalChart({ 
  data = dadosExemplo, 
  tipo = 'line',
  altura = 300 
}: EvolucaoSemanalChartProps) {
  const renderChart = () => {
    switch (tipo) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="dia" 
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <YAxis className="text-xs" tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="agendamentos" 
              fill="#3b82f6" 
              name="Agendamentos"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="realizados" 
              fill="#10b981" 
              name="Realizados"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="prontuarios" 
              fill="#8b5cf6" 
              name="Prontuários"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        )
      
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="dia" 
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <YAxis className="text-xs" tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="agendamentos" 
              stackId="1"
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.6}
              name="Agendamentos"
            />
            <Area 
              type="monotone" 
              dataKey="realizados" 
              stackId="1"
              stroke="#10b981" 
              fill="#10b981" 
              fillOpacity={0.6}
              name="Realizados"
            />
            <Area 
              type="monotone" 
              dataKey="prontuarios" 
              stackId="1"
              stroke="#8b5cf6" 
              fill="#8b5cf6" 
              fillOpacity={0.6}
              name="Prontuários"
            />
          </AreaChart>
        )
      
      default: // line
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="dia" 
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <YAxis className="text-xs" tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="agendamentos" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              name="Agendamentos"
            />
            <Line 
              type="monotone" 
              dataKey="realizados" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              name="Realizados"
            />
            <Line 
              type="monotone" 
              dataKey="prontuarios" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              name="Prontuários"
            />
          </LineChart>
        )
    }
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={altura}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  )
}

// Componente específico para receita
export function EvolucaoReceitaChart({ 
  data = dadosExemplo, 
  altura = 300 
}: Omit<EvolucaoSemanalChartProps, 'tipo'>) {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={altura}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="dia" 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            className="text-xs" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `R$ ${value}`}
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
                    <p className="text-emerald-600 font-medium">
                      Receita: R$ {payload[0].value}
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Area 
            type="monotone" 
            dataKey="receita" 
            stroke="#10b981" 
            fill="#10b981" 
            fillOpacity={0.3}
            strokeWidth={2}
            name="Receita"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
} 