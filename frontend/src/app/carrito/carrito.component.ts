import { Component, OnInit } from '@angular/core';
import { Libro } from '../modelo/libro';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../carrito.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {


  carrito: Libro[] = [];
  mostrarComprobante: boolean = false;
  detalleCompra: Libro[] = [];
  totalCompra: number = 0;

  constructor(private carritoService: CarritoService, private router: Router) { } // 👈 INYECTA

  ngOnInit(): void {
    this.carrito = this.carritoService.obtenerCarrito(); // ✅ Usa el servicio
    // Verifica si se venía del login con intención de compra
    const intento = sessionStorage.getItem('intentoCompra');
    const usuario = sessionStorage.getItem('correo');
    if (intento && usuario) {
      sessionStorage.removeItem('intentoCompra'); // Limpia el intento
      this.realizarCompra(); // Ejecuta la compra automáticamente
    }
  }

  eliminarDelCarrito(libro: Libro): void {
    this.carritoService.eliminar(libro.id);      // ✅ Usa el servicio
    this.carrito = this.carritoService.obtenerCarrito(); // Refresca la vista
  }

  vaciarCarrito(): void {
    this.carritoService.vaciar();               // ✅ Usa el servicio
    this.carrito = [];                          // Limpia la vista
  }

  obtenerTotal(): number {
    return this.carrito.reduce((suma, libro) => suma + libro.precio, 0);
  }

  realizarCompra(): void {
    const correo = sessionStorage.getItem('correo');

    // Si no ha iniciado sesión
    if (!correo) {
      alert("⚠️ Debes iniciar sesión antes de comprar.");
      this.router.navigate(['/login'], { queryParams: { returnTo: 'carrito' } }); // 👈 Redirige al login con parámetro
      return;
    }

    // Si está logueado, continuar la compra
    this.detalleCompra = [...this.carrito];
    this.totalCompra = this.obtenerTotal();
    this.mostrarComprobante = true;

    this.vaciarCarrito();
  }

  cerrarComprobante(): void {
    this.mostrarComprobante = false;
  }

  imprimirTicket() {
    const ticket = document.querySelector('.ticket-flotante');
    if (ticket) {
      const copia = ticket.cloneNode(true) as HTMLElement;

      // ✅ ELIMINAR todos los botones con la clase .no-imprimir
      const botones = copia.querySelectorAll('.no-imprimir');
      botones.forEach(boton => boton.remove());

      // 🧾 Crear la ventana de impresión
      const ventana = window.open('', '', 'width=600,height=700');
      if (ventana) {
        ventana.document.write(`
        <html>
          <head>
            <title>Ticket de Compra</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
              }
              .text-center { text-align: center; }
              .fw-bold { font-weight: bold; }
            </style>
          </head>
          <body>
            ${copia.innerHTML}
          </body>
        </html>
      `);
        ventana.document.close();
        ventana.focus();
        ventana.print();
        ventana.close();
      }
    }
  }
}
