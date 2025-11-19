import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Libro } from './modelo/libro';
import { LoginRequest } from './modelo/LoginRequest';
import { LoginResponse } from './modelo/LoginResponse';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private url = 'http://localhost:8080/api/libros';  // URL del backend
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  // Obtener todos los libros
  public getLibros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.url);
  }

  // Crear nuevo libro
  public createLibro(libro: Libro, rol: string): Observable<Libro> {
    return this.http.post<Libro>(`${this.url}?rol=${rol}`, libro);
  }

  // Obtener libro por ID
  public getLibroById(id: number): Observable<Libro> {
    return this.http.get<Libro>(`${this.url}/${id}`);
  }

  // Actualizar libro
  updateLibro(libro: Libro, rol: string): Observable<any> {
    return this.http.put(`${this.url}/${libro.id}?rol=${rol}`, libro);
  }

  // Eliminar libro
  public deleteLibro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  buscarPorTitulo(titulo: string) {
    return this.http.get<Libro[]>(`http://localhost:8080/api/libros/buscar?titulo=${titulo}`);
  }

  buscarPorAutor(autor: string) {
    return this.http.get<Libro[]>(`http://localhost:8080/api/libros/buscar?autor=${autor}`);
  }

  uploadImage(formData: FormData): Observable<string> {
    return this.http.post('http://localhost:8080/api/libros/libros/upload', formData, {
      responseType: 'text' as 'text'
    });
  }

  login(datos: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, datos);
  }

  buscarPorGenero(genero: string) {
    return this.http.get<Libro[]>(`http://localhost:8080/api/libros/categoria/${genero}`);
  }

  buscarPorTituloYCategoria(titulo: string, categoria: string): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.url}/buscar/titulo/${titulo}/categoria/${categoria}`);
  }

  registrarUsuario(usuario: LoginRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/registrar`, usuario); // ← esta ruta la crearás ahora en el backend
  }
}
