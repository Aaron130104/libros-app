import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Libro } from '../modelo/libro';
import { ActivatedRoute } from '@angular/router';
import { CarritoService } from '../carrito.service';

@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './listar.component.html',
  styleUrl: './listar.component.css'
})
export class ListarComponent implements OnInit {

  rutaImagen = 'http://localhost:8080/uploads/';
  data: Libro[] = [];         // Arreglo para guardar los libros obtenidos
  mensajeError: string = '';  // Mensaje para mostrar errores
  valorBusqueda: string = '';
  mensajeInformativo: string = '';
  categoriaActual: string | null = null;
  rolUsuario: string = '';
  esAdmin: boolean = false;


  constructor(private libroService: ServiceService, private router: Router, private route: ActivatedRoute, private carritoService: CarritoService) { }

  // Método para cargar los datos de libros desde la API
  cargarDatos() {
    this.libroService.getLibros().subscribe(
      data => {
        this.data = data;
        console.log(this.data);
        this.mensajeError = '';
      }
    );
  }

  // Redirigir a la vista de edición y guardar el ID
  Editar(libro: Libro) {
    sessionStorage.setItem("id", libro.id.toString());
    this.router.navigate(["editar-libro"]);
  }

  // Eliminar un libro con confirmación
  Delete(libro: Libro) {
    if (confirm("¿Estás seguro de eliminar este libro?")) {
      this.libroService.deleteLibro(libro.id).subscribe(() => {
        this.data = this.data.filter(l => l !== libro);
        alert("Libro eliminado correctamente");
      });
    }
  }

  buscar() {
    const valor = this.valorBusqueda.trim();

    if (!valor) {
      this.mensajeInformativo = '⚠️ Ingresa un título para buscar.';
      this.data = [];
      return;
    }

    this.mensajeInformativo = '';
    this.mensajeError = '';

    // Si estás en una categoría, busca por título + categoría
    if (this.categoriaActual) {
      this.libroService.buscarPorTituloYCategoria(valor, this.categoriaActual).subscribe(data => {
        this.data = data;
        if (data.length === 0) {
          this.mensajeError = '❌ No se encontraron libros con ese título en esta categoría';
        }
      }, error => {
        this.mensajeError = '❌ Error al buscar por categoría';
      });
    } else {
      this.libroService.buscarPorTitulo(valor).subscribe(data => {
        this.data = data;
        if (data.length === 0) {
          this.mensajeError = '❌ No se encontraron libros con ese título';
        }
      }, error => {
        this.mensajeError = '❌ Error al buscar';
      });
    }
  }

  NuevoLibro() {
    this.router.navigate(['nuevo-libro']);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const generoUrl = params.get('genero');
      if (generoUrl) {
        // Reemplaza guiones por espacios y ajusta mayúsculas
        const generoFormateado = this.formatearCategoriaDesdeURL(generoUrl);
        this.categoriaActual = generoFormateado;
        this.buscarPorGenero(generoFormateado);
      } else {
        this.categoriaActual = null;
        this.cargarDatos();
      }

      this.rolUsuario = sessionStorage.getItem('rol') || '';

      const rol = sessionStorage.getItem('rol');
      this.esAdmin = rol === 'ADMIN';
      
    });
  }


  buscarPorGenero(genero: string) {
    this.libroService.buscarPorGenero(genero).subscribe(data => {
      this.data = data;
    });
  }

  formatearCategoriaDesdeURL(categoriaUrl: string): string {
    return categoriaUrl
      .replace(/-/g, ' ') // cambia "-" por espacio
      .split(' ')
      .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join(' ');
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
