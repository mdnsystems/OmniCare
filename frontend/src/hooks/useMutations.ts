import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { 
  usuarioSchema, 
  especialidadeSchema, 
  anamneseSchema, 
  exameSchema, 
  mensagemSchema, 
  prontuarioSchema, 
  agendamentoSchema, 
  pacienteSchema, 
  profissionalSchema 
} from '@/schemas';

// Usuário
export const useUsuarioMutations = () => {
  const queryClient = useQueryClient();

  const registrar = useMutation({
    mutationFn: async (data: typeof usuarioSchema._type) => {
      const response = await api.post('/usuarios/registrar', data);
      return response.data;
    },
  });

  const login = useMutation({
    mutationFn: async (data: { email: string; senha: string }) => {
      const response = await api.post('/usuarios/login', data);
      return response.data;
    },
  });

  return { registrar, login };
};

// Especialidade
export const useEspecialidadeMutations = () => {
  const queryClient = useQueryClient();

  const criar = useMutation({
    mutationFn: async (data: typeof especialidadeSchema._type) => {
      const response = await api.post('/especialidades', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['especialidades'] });
    },
  });

  const deletar = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/especialidades/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['especialidades'] });
    },
  });

  return { criar, deletar };
};

// Anamnese
export const useAnamneseMutations = () => {
  const queryClient = useQueryClient();

  const criar = useMutation({
    mutationFn: async (data: typeof anamneseSchema._type) => {
      const response = await api.post('/anamneses', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anamneses'] });
    },
  });

  const atualizar = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof anamneseSchema._type }) => {
      const response = await api.put(`/anamneses/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anamneses'] });
    },
  });

  const deletar = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/anamneses/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anamneses'] });
    },
  });

  return { criar, atualizar, deletar };
};

// Exame
export const useExameMutations = () => {
  const queryClient = useQueryClient();

  const criar = useMutation({
    mutationFn: async (data: typeof exameSchema._type) => {
      const response = await api.post('/exames', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exames'] });
    },
  });

  const deletar = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/exames/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exames'] });
    },
  });

  return { criar, deletar };
};

// Mensagem
export const useMensagemMutations = () => {
  const queryClient = useQueryClient();

  const criar = useMutation({
    mutationFn: async (data: typeof mensagemSchema._type) => {
      const response = await api.post('/mensagens', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mensagens'] });
    },
  });

  const deletar = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/mensagens/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mensagens'] });
    },
  });

  return { criar, deletar };
};

// Prontuário
export const useProntuarioMutations = () => {
  const queryClient = useQueryClient();

  const criar = useMutation({
    mutationFn: async (data: typeof prontuarioSchema._type) => {
      const response = await api.post('/prontuarios', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prontuarios'] });
    },
  });

  const atualizar = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof prontuarioSchema._type }) => {
      const response = await api.put(`/prontuarios/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prontuarios'] });
    },
  });

  const deletar = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/prontuarios/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prontuarios'] });
    },
  });

  return { criar, atualizar, deletar };
};

// Agendamento
export const useAgendamentoMutations = () => {
  const queryClient = useQueryClient();

  const criar = useMutation({
    mutationFn: async (data: typeof agendamentoSchema._type) => {
      const response = await api.post('/agendamentos', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
    },
  });

  const atualizar = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof agendamentoSchema._type }) => {
      const response = await api.put(`/agendamentos/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
    },
  });

  const deletar = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/agendamentos/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
    },
  });

  return { criar, atualizar, deletar };
};

// Paciente
export const usePacienteMutations = () => {
  const queryClient = useQueryClient();

  const criar = useMutation({
    mutationFn: async (data: typeof pacienteSchema._type) => {
      const response = await api.post('/pacientes', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
    },
  });

  const atualizar = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof pacienteSchema._type }) => {
      const response = await api.put(`/pacientes/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
    },
  });

  const deletar = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/pacientes/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
    },
  });

  return { criar, atualizar, deletar };
};

// Profissional
export const useProfissionalMutations = () => {
  const queryClient = useQueryClient();

  const criar = useMutation({
    mutationFn: async (data: typeof profissionalSchema._type) => {
      const response = await api.post('/profissionais', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profissionais'] });
    },
  });

  const atualizar = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof profissionalSchema._type }) => {
      const response = await api.put(`/profissionais/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profissionais'] });
    },
  });

  const deletar = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/profissionais/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profissionais'] });
    },
  });

  return { criar, atualizar, deletar };
}; 