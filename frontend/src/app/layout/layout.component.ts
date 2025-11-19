import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CarritoService } from '../carrito.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {

  cantidadLibros = 0;

  constructor(private router: Router, private carritoService: CarritoService) { }

  cerrarSesion() {
    sessionStorage.clear();
    alert('🚪 Has cerrado sesión exitosamente.');
    this.router.navigate(['/inicio']);
  }

  ngOnInit(): void {
    this.carritoService.contador$.subscribe(cantidad => {
      this.cantidadLibros = cantidad;
    });
  }

  estaLogueado(): boolean {
    return !!sessionStorage.getItem('correo');
  }

  obtenerCorreo(): string | null {
    return sessionStorage.getItem('correo');
  }

  tamanioActual: number = 100; // 100% por defecto

  cambiarTamanioTexto(accion: string): void {
    if (accion === '+') {
      this.tamanioActual += 10;
    } else if (accion === '-') {
      this.tamanioActual = Math.max(50, this.tamanioActual - 10); // mínimo 50%
    }

    document.body.style.fontSize = `${this.tamanioActual}%`;
  }

}
