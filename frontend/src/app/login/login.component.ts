import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ServiceService } from '../service.service';
import { LoginRequest } from '../modelo/LoginRequest';
import { LoginResponse } from '../modelo/LoginResponse';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  usuario: string = '';
  contrasena: string = '';
  mensaje: string = '';
  formularioEnviado: boolean = false;
  errorUsuario: string = '';
  errorClave: string = '';


  constructor(private router: Router, private service: ServiceService, private route: ActivatedRoute) { }

  iniciarSesion() {
    this.errorUsuario = '';
    this.errorClave = '';
    this.formularioEnviado = true;

    if (!this.usuario || !this.contrasena) {
      return;
    }

    const correoRegex = /^[\w.-]+@[\w-]+\.[a-zA-Z]{2,}$/;
    if (!correoRegex.test(this.usuario)) {
      this.errorUsuario = '⚠️ El correo ingresado no es válido.';
      return;
    }

    const datos: LoginRequest = {
      correo: this.usuario,
      clave: this.contrasena
    };

    this.service.login(datos).subscribe({
      next: (resp: LoginResponse) => {
        sessionStorage.setItem('rol', resp.rol);
        sessionStorage.setItem('correo', resp.correo);
        const destino = this.route.snapshot.queryParamMap.get('returnTo') || 'inicio';
        this.router.navigate([`/${destino}`]);

      },
      error: (err) => {
        const msg = err.error?.mensaje || '';
        if (msg.includes('usuario')) {
          this.errorUsuario = `⚠️ ${msg}`;
        } else if (msg.includes('Contraseña')) {
          this.errorClave = `⚠️ ${msg}`;
        }
      }
    });
  }
}
