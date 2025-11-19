import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'libros-app';

  constructor(private router: Router) {}

  // Método para ir a la vista 'listar-libros'
  ListarLibros() {
    this.router.navigate(['listar-libros']);
  }

  // Método para ir a la vista 'nuevo-libro'
  NuevoLibro() {
    this.router.navigate(['nuevo-libro']);
  }
}
