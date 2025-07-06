import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function calcularIdade(dataNascimento: Date | string): number {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mesAtual = hoje.getMonth();
  const mesNascimento = nascimento.getMonth();
  
  if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  
  return idade;
}

export function obterIniciais(nome: string): string {
  if (!nome) return '';
  
  const nomes = nome.trim().split(' ');
  if (nomes.length === 1) {
    return nomes[0].charAt(0).toUpperCase();
  }
  
  return (nomes[0].charAt(0) + nomes[nomes.length - 1].charAt(0)).toUpperCase();
}

export function obterEspecialidadePorRole(role: string): string {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'Administrador';
    case 'ADMIN':
      return 'Administrador';
    case 'PROFISSIONAL':
      return 'Profissional';
    case 'RECEPCIONISTA':
      return 'Recepcionista';
    default:
      return 'Usuário';
  }
}
