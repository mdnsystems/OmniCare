import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Users, FileText, Clock, Eye, EyeOff } from 'lucide-react';
import { loginSchema, type LoginFormData } from '@/schemas/auth';
import { useAuth } from '@/contexts/AuthContext';

export function Login() {
  const { toast } = useToast();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await signIn(data.email, data.senha);
      toast({
        title: 'Login realizado com sucesso',
        description: 'Bem-vindo ao OmniCare!',
      });
      // O redirecionamento será feito automaticamente pelo AuthContext
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: 'Erro ao fazer login',
        description: 'Verifique suas credenciais e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo */}
      <div className="hidden md:block w-3/5 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-900"/>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <div className="text-white text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Bem-vindo ao OmniCare</h2>
            <p className="text-lg">
              Sistema de gestão médica completo para sua clínica
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 max-w-2xl">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <Calendar className="w-8 h-8 text-white mb-4" />
              <h3 className="text-white font-semibold mb-2">Agendamento</h3>
              <p className="text-white/80 text-sm">
                Agende consultas e procedimentos de forma rápida e eficiente
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <Users className="w-8 h-8 text-white mb-4" />
              <h3 className="text-white font-semibold mb-2">Gestão de Pacientes</h3>
              <p className="text-white/80 text-sm">
                Controle completo do histórico e prontuários dos pacientes
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <FileText className="w-8 h-8 text-white mb-4" />
              <h3 className="text-white font-semibold mb-2">Prontuários</h3>
              <p className="text-white/80 text-sm">
                Acesso rápido e seguro aos prontuários eletrônicos
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <Clock className="w-8 h-8 text-white mb-4" />
              <h3 className="text-white font-semibold mb-2">Horários</h3>
              <p className="text-white/80 text-sm">
                Controle de agenda e disponibilidade dos profissionais
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="w-full md:w-2/5 p-8 bg-white flex items-center justify-center">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Login</h1>
            <p className="text-gray-600">Entre com suas credenciais</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="w-full text-gray-700 border-gray-300"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha" className="text-gray-700">Senha</Label>
              <div className="relative">
                <Input
                  id="senha"
                  type={showPassword ? "text" : "password"}
                  placeholder="******"
                  className="w-full pr-10 text-gray-700 border-gray-300"
                  {...register('senha')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.senha && (
                <p className="text-sm text-red-500">{errors.senha.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-900/80 to-blue-900 hover:from-blue-900 hover:to-blue-900/60 text-white cursor-pointer transition-all duration-300 ease-in-out transform"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 