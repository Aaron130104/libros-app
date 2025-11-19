import { Injectable } from '@angular/core';
import { Libro } from './modelo/libro';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private carrito: Libro[] = [];
  private contador = new BehaviorSubject<number>(0); // 👈 esta es la que usa .next()
  contador$ = this.contador.asObservable();

  constructor() {
    const guardado = sessionStorage.getItem('carrito');
    this.carrito = guardado ? JSON.parse(guardado) : [];
    this.contador.next(this.carrito.length);  // ✅ Esto es importante
  }

  agregar(libro: Libro): boolean {

    this.carrito.push(libro);
    sessionStorage.setItem('carrito', JSON.stringify(this.carrito));
    this.contador.next(this.carrito.length);  // ✅ también aquí
    return true;
  }

  eliminar(id: number): void {
    this.carrito = this.carrito.filter(l => l.id !== id);
    this.actualizarCarrito();
  }

  obtenerCarrito(): Libro[] {
    return [...this.carrito];
  }

  vaciar(): void {
    this.carrito = [];
    this.actualizarCarrito();
  }

  private actualizarCarrito() {
    sessionStorage.setItem('carrito', JSON.stringify(this.carrito));
    this.contador.next(this.carrito.length); // esto actualiza el observable
  }
}
