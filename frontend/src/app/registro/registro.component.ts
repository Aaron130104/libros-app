import { Component } from '@angular/core';
import { LoginRequest } from '../modelo/LoginRequest';
import { ServiceService } from '../service.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginResponse } from '../modelo/LoginResponse';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  usuario: LoginRequest = { correo: '', clave: '' };
  mensaje: string = '';

  constructor(private service: ServiceService, private router: Router) { }

  registrar(): void {
    if (!this.usuario.correo || !this.usuario.clave) {
      this.mensaje = '⚠️ Completa todos los campos.';
      return;
    }

    this.service.registrarUsuario(this.usuario).subscribe({
      next: () => {
        this.mensaje = '✅ Cuenta creada con éxito. Ahora puedes iniciar sesión.';
        this.usuario = { correo: '', clave: '' };
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: err => {
        this.mensaje = '❌ Error al registrar: ' + (err.error?.mensaje || 'Servidor no responde');
      }
    });
  }

}
