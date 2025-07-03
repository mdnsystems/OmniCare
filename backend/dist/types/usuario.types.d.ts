import { RoleUsuario } from './enums';
export interface UsuarioRegistro {
    email: string;
    senha: string;
    role: RoleUsuario;
}
export interface UsuarioLogin {
    email: string;
    senha: string;
}
export interface UsuarioResponse {
    id: string;
    email: string;
    role: RoleUsuario;
}
export interface LoginResponse {
    token: string;
    usuario: UsuarioResponse;
}
