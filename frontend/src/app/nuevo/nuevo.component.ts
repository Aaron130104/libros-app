import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ServiceService } from '../service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Libro } from '../modelo/libro';

@Component({
  selector: 'app-nuevo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './nuevo.component.html',
  styleUrl: './nuevo.component.css'
})
export class NuevoComponent implements OnInit {

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
  selectedImage?: File;             // ← imagen seleccionada
  previewImageUrl: string = '';     // ← para mostrar la vista previa
  mensajesError: string[] = [];
  erroresCampos: { [key: string]: string } = {};
  esAdmin: boolean = false;

  constructor(private router: Router, private service: ServiceService) { }

  Guardar(libro: Libro) {

    const rol = sessionStorage.getItem('rol');
    if (rol !== 'ADMIN') {
      alert('🚫 No tienes permisos para agregar libros.');
      return;
    }
    this.mensajesError = [];
    this.erroresCampos = {};

    const guardarLibro = () => {

      this.libro.id = null as any; // 👈 Asegúrate de enviar null, no 0

      console.log("📘 Enviando al backend:", this.libro);

      this.service.createLibro(this.libro, rol!).subscribe({
        next: () => {
          alert("📘 Libro añadido...");
          this.router.navigate(["inicio"]);
        },
        error: (err) => {
          console.error("❌ ERROR DETALLADO DEL BACKEND:", err.error); // ← AQUÍ

          const mensajes = err.error;
          if (Array.isArray(mensajes)) {
            mensajes.forEach((mensaje: string) => {
              const lower = mensaje.toLowerCase();

              if (lower.includes('título')) this.erroresCampos['titulo'] = mensaje;
              else if (lower.includes('autor') && !lower.includes('nacionalidad')) this.erroresCampos['autor'] = mensaje;
              else if (lower.includes('nacionalidad')) this.erroresCampos['nacionalidadAutor'] = mensaje;
              else if (lower.includes('año')) this.erroresCampos['anioPublicacion'] = mensaje;
              else if (lower.includes('genero') || lower.includes('género')) this.erroresCampos['generoLiterario'] = mensaje;
              else if (lower.includes('precio')) this.erroresCampos['precio'] = mensaje;
              else if (lower.includes('formato')) this.erroresCampos['formato'] = mensaje;
              else if (lower.includes('accesible')) this.erroresCampos['accesible'] = mensaje;
              else if (lower.includes('tema')) this.erroresCampos['temaPrincipal'] = mensaje;
              else if (lower.includes('portada')) this.erroresCampos['portada'] = mensaje;
              else this.mensajesError.push(mensaje);
            });
          }
        }
      });
    };

    if (this.selectedImage) {
      const formData = new FormData();
      formData.append("image", this.selectedImage);
      this.service.uploadImage(formData).subscribe({
        next: (nombreImagen: string) => {
          libro.portada = nombreImagen;
          guardarLibro();
        },
        error: () => alert("Error al subir imagen")
      });
    } else {
      guardarLibro();
    }
  }

  ngOnInit(): void { }

  onImageSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedImage = file;

      // Vista previa
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    const rol = sessionStorage.getItem('rol');
    this.esAdmin = rol === 'ADMIN';
  }

}
