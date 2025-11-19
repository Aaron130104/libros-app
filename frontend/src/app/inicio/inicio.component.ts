import { Component, OnInit } from '@angular/core';
import { Libro } from '../modelo/libro';
import { ServiceService } from '../service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CarritoService } from '../carrito.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {

  libros: Libro[] = [];
  rutaImagen = 'http://localhost:8080/uploads/';
  valorBusqueda: string = '';
  mensajeInformativo: string = '';
  mensajeError: string = '';
  esAdmin: boolean = false;
  data: Libro[] = [];


  constructor(private service: ServiceService, private carritoService: CarritoService) { }

  ngOnInit(): void {
    this.service.getLibros().subscribe(data => {
      this.libros = data;
    });

    const rol = sessionStorage.getItem('rol');
    this.esAdmin = rol === 'ADMIN';
    this.cargarDatos();
  }

  buscar() {
    const valor = this.valorBusqueda.trim();

    if (!valor) {
      this.mensajeInformativo = '⚠️ Ingresa un título para buscar.';
      this.libros = [];
      return;
    }

    this.mensajeInformativo = '';
    this.mensajeError = '';

    this.service.buscarPorTitulo(valor).subscribe(data => {
      this.libros = data;
      if (data.length === 0) {
        this.mensajeError = '❌ No se encontraron libros con ese título';
      }
    }, error => {
      this.mensajeError = '❌ Error al buscar libros';
      this.libros = [];
    });
  }

  cargarDatos() {
    this.service.getLibros().subscribe(data => {
      this.libros = data;
      this.mensajeError = '';
      this.mensajeInformativo = '';
    });
  }

  // Eliminar un libro con confirmación
  Delete(libro: Libro) {
    if (confirm("¿Estás seguro de eliminar este libro?")) {
      this.service.deleteLibro(libro.id).subscribe(() => {
        this.data = this.data.filter(l => l !== libro);
        alert("Libro eliminado correctamente");
      });
    }
  }

  agregarAlCarrito(libro: Libro) {
    const agregado = this.carritoService.agregar(libro);

    if (agregado) {
      alert("✅ Libro añadido al carrito");
    } else {
      alert("⚠️ Este libro ya está en el carrito.");
    }
  }



}
