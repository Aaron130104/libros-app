export interface LoginRequest {

    correo: string;
    clave: string;
    rol?: string; // Opcional, si el rol es necesario en el login
}