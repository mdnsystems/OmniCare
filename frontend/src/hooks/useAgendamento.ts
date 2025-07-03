import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { api, extractData } from '@/lib/axios';
import { Agendamento } from '@/types/api';

export function useAgendamento() {
	const listByDate = (date: Date | null, professionalId?: string) => {
		const { data, isLoading, error } = useQuery({
			queryKey: ['agendamentos', date, professionalId],
			queryFn: async () => {
				if (!date) {
					return [];
				}

				const params = new URLSearchParams();
				params.append('data', format(date, 'yyyy-MM-dd'));
				if (professionalId && professionalId !== 'TODOS') {
					params.append('profissionalId', professionalId);
				}

				const response = await api.get(`/agendamentos?${params.toString()}`);
				return extractData(response) as Agendamento[];
			},
			enabled: !!date,
			staleTime: 1000 * 60 * 2, // 2 minutos
		});

		return {
			data: data || [],
			isLoading,
			error
		};
	};

	return {
		listByDate
	};
} 