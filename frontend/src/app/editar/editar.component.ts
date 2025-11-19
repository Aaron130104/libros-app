import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ServiceService } from '../service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Libro } from '../modelo/libro';

@Component({
  selector: 'app-editar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './editar.component.html',
  styleUrl: './editar.component.css'
})
export class EditarComponent implements OnInit {

  libro: Libro = {
    id: 0,
    titulo: '',
    autor: '',
    nacionalidadAutor: '',
    anioPublicacion: 0,
    generoLiterario: '',
    precio: 0,
    formato: '',
    accesible: false,
    temaPrincipal: '',
    portada: ''
  };
  selectedImage?: File;
  previewImageUrl: string = '';
  rutaImagen = 'http://localhost:8080/uploads/'; // igual que en listar
  librosDisponibles: Libro[] = []; // lista de libros para el combo
  idSeleccionado: number | null = null; // ID elegido desde el combo
  mensajesError: string[] = [];
  erroresCampos: { [key: string]: string } = {};


  constructor(private router: Router, private service: ServiceService) { }

  // Cargar todos los libros
  obtenerLibros() {
    this.service.getLibros().subscribe(data => {
      this.librosDisponibles = data;
      console.log("Libros cargados:", this.librosDisponibles); // DEBUG

    });
  }

  // Cuando seleccionas un ID
  cargarDatosSeleccionados() {
    if (this.idSeleccionado != null) {
      this.service.getLibroById(this.idSeleccionado).subscribe(data => {
        this.libro = data;
        this.previewImageUrl = ''; // limpia preview
        this.selectedImage = undefined;
      });
    }
  }

  // Carga los datos del libro desde el ID guardado
  Editar() {
    let id = sessionStorage.getItem('id');
    this.service.getLibroById(+id!).subscribe(data => {
      this.libro = data;
    });
  }

  Guardar(libro: Libro) {
    this.mensajesError = [];
    this.erroresCampos = {};

    const actualizar = () => {
      const rol = sessionStorage.getItem('rol') || 'ADMIN'; // ← o ADMIN si es admin
      console.log("ROL ENVIADO AL BACKEND:", rol);
      this.service.updateLibro(libro, rol).subscribe({
        next: () => {
          alert("📘 Libro modificado correctamente.");
          this.router.navigate([""]);
        },
        error: (err) => {
          const errorData = err.error;

          if (Array.isArray(errorData)) {
            errorData.forEach((mensaje: string) => {
              const lower = mensaje.toLowerCase();
              if (lower.includes('título')) this.erroresCampos['titulo'] = mensaje;
              else if (lower.includes('autor') && !lower.includes('nacionalidad')) this.erroresCampos['autor'] = mensaje;
              else if (lower.includes('nacionalidad')) this.erroresCampos['nacionalidadAutor'] = mensaje;
              else if (lower.includes('año')) this.erroresCampos['anioPublicacion'] = mensaje;
              else if (lower.includes('género')) this.erroresCampos['generoLiterario'] = mensaje;
              else if (lower.includes('precio')) this.erroresCampos['precio'] = mensaje;
              else if (lower.includes('formato')) this.erroresCampos['formato'] = mensaje;
              else if (lower.includes('accesible')) this.erroresCampos['accesible'] = mensaje;
              else if (lower.includes('tema')) this.erroresCampos['temaPrincipal'] = mensaje;
              else if (lower.includes('portada')) this.erroresCampos['portada'] = mensaje;
              else this.mensajesError.push(mensaje);
            });
          } else if (typeof errorData === 'object' && errorData.mensaje) {
            this.mensajesError.push(errorData.mensaje); // ejemplo: {mensaje: "No se encontró el libro"}
          } else {
            this.mensajesError.push("❌ Error inesperado");
          }
        }
      });
    };

    if (this.selectedImage) {
      const formData = new FormData();
      formData.append("image", this.selectedImage);

      this.service.uploadImage(formData).subscribe({
        next: (nombreImagen) => {
          libro.portada = nombreImagen;
          actualizar();
        },
        error: () => alert("Error al subir imagen")
      });
    } else {
      actualizar();
    }
  }

  onImageSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedImage = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  ngOnInit(): void {
    this.Editar();
    this.obtenerLibros();  // cargamos la lista de libros
  }

}
