import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

// Especialidade
export const useEspecialidades = () => {
  return useQuery({
    queryKey: ['especialidades'],
    queryFn: async () => {
      const response = await api.get('/especialidades');
      // A API retorna { success: true, data: [] }
      return response.data.data || [];
    },
  });
};

export const useEspecialidade = (id: string) => {
  return useQuery({
    queryKey: ['especialidade', id],
    queryFn: async () => {
      const response = await api.get(`/especialidades/${id}`);
      return response.data.data;
    },
  });
};

// Anamnese
export const useAnamneses = () => {
  return useQuery({
    queryKey: ['anamneses'],
    queryFn: async () => {
      const response = await api.get('/anamneses');
      // A API retorna { success: true, data: [] }
      return response.data.data || [];
    },
  });
};

export const useAnamnese = (id: string) => {
  return useQuery({
    queryKey: ['anamnese', id],
    queryFn: async () => {
      const response = await api.get(`/anamneses/${id}`);
      return response.data.data;
    },
  });
};

// Exame
export const useExame = (id: string) => {
  return useQuery({
    queryKey: ['exame', id],
    queryFn: async () => {
      const response = await api.get(`/exames/${id}`);
      return response.data.data;
    },
  });
};

// Mensagem
export const useMensagens = () => {
  return useQuery({
    queryKey: ['mensagens'],
    queryFn: async () => {
      const response = await api.get('/mensagens');
      // A API retorna { success: true, data: [] }
      return response.data.data || [];
    },
  });
};

export const useMensagem = (id: string) => {
  return useQuery({
    queryKey: ['mensagem', id],
    queryFn: async () => {
      const response = await api.get(`/mensagens/${id}`);
      return response.data.data;
    },
  });
};

// Prontuário
export const useProntuarios = () => {
  return useQuery({
    queryKey: ['prontuarios'],
    queryFn: async () => {
      const response = await api.get('/prontuarios');
      // A API retorna { success: true, data: [] }
      return response.data.data || [];
    },
  });
};

export const useProntuario = (id: string) => {
  return useQuery({
    queryKey: ['prontuario', id],
    queryFn: async () => {
      const response = await api.get(`/prontuarios/${id}`);
      return response.data.data;
    },
  });
};

// Agendamento
export const useAgendamentos = () => {
  return useQuery({
    queryKey: ['agendamentos'],
    queryFn: async () => {
      const response = await api.get('/agendamentos');
      // A API retorna { success: true, data: [] }
      return response.data.data || [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
};

export const useAgendamento = (id: string) => {
  return useQuery({
    queryKey: ['agendamento', id],
    queryFn: async () => {
      const response = await api.get(`/agendamentos/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Paciente
export const usePacientes = () => {
  return useQuery({
    queryKey: ['pacientes'],
    queryFn: async () => {
      const response = await api.get('/pacientes');
      // A API retorna { success: true, data: { data: [], pagination: {} } }
      return response.data.data?.data || [];
    },
  });
};

export const usePaciente = (id: string) => {
  return useQuery({
    queryKey: ['paciente', id],
    queryFn: async () => {
      const response = await api.get(`/pacientes/${id}`);
      // A API retorna { success: true, data: {} }
      return response.data.data;
    },
  });
};

// Profissional
export const useProfissionais = () => {
  return useQuery({
    queryKey: ['profissionais'],
    queryFn: async () => {
      const response = await api.get('/profissionais');
      // A API retorna { success: true, data: [] }
      return response.data.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

export const useProfissional = (id: string) => {
  return useQuery({
    queryKey: ['profissional', id],
    queryFn: async () => {
      const response = await api.get(`/profissionais/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}; 