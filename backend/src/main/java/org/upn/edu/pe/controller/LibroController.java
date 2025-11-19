package org.upn.edu.pe.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.upn.edu.pe.model.Libro;
import org.upn.edu.pe.service.LibroService;

@RestController
@RequestMapping("/api/libros")
@CrossOrigin(origins = "*") // Permitir peticiones desde frontend

public class LibroController {

	@Autowired
	private LibroService libroService;

	@GetMapping
	public List<Libro> listarLibros() {
		return libroService.listarTodos();
	}

	// Buscar por título o autor
	@GetMapping("/buscar")
	public List<Libro> buscarLibros(@RequestParam(required = false) String titulo,
			@RequestParam(required = false) String autor) {
		if (titulo != null && !titulo.isEmpty()) {
			return libroService.buscarPorTitulo(titulo);
		} else if (autor != null && !autor.isEmpty()) {
			return libroService.buscarPorAutor(autor);
		} else {
			return libroService.listarTodos(); // Si no se envía ningún parámetro
		}
	}

	@GetMapping("/{id}")
	public ResponseEntity<Libro> obtenerLibro(@PathVariable Long id) {
		return libroService.obtenerPorId(id).map(libro -> ResponseEntity.ok().body(libro))
				.orElse(ResponseEntity.notFound().build());
	}

	@PostMapping  //http://localhost:8080/api/libros?rol=ADMIN
	public ResponseEntity<?> crearLibro(@RequestBody Libro libro, @RequestParam String rol) {
		if (!"ADMIN".equalsIgnoreCase(rol)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("🚫 No tienes permisos para agregar libros.");
		}

		List<String> errores = new ArrayList<>();

		if (libro.getTitulo() == null || libro.getTitulo().trim().isEmpty()) {
			errores.add("❌ El título es obligatorio.");
		}

		if (libro.getAutor() == null || libro.getAutor().trim().isEmpty()) {
			errores.add("❌ El autor es obligatorio.");
		}

		if (libro.getNacionalidadAutor() == null || libro.getNacionalidadAutor().trim().isEmpty()) {
			errores.add("❌ La Nacionalidad del autor es obligatorio.");
		}

		if (libro.getAnioPublicacion() == null || libro.getAnioPublicacion() < 1500
				|| libro.getAnioPublicacion() > 2025) {
			errores.add("❌ Año de publicación inválido.");
		}

		if (libro.getGeneroLiterario() == null || libro.getGeneroLiterario().trim().isEmpty()) {
			errores.add("❌ El Genero Literario es obligatorio.");
		}

		if (libro.getPrecio() == null || libro.getPrecio() <= 0) {
			errores.add("❌ El precio debe ser mayor a 0.");
		}

		if (libro.getFormato() == null || libro.getFormato().trim().isEmpty()) {
			errores.add("❌ El formato es obligatorio.");
		}

		if (libro.getAccesible() == null) {
			errores.add("❌ Debes indicar si el libro es accesible.");
		}

		if (libro.getTemaPrincipal() == null || libro.getTemaPrincipal().trim().isEmpty()) {
			errores.add("❌ El tema principal es obligatorio.");
		}

		if (libro.getPortada() == null || libro.getPortada().trim().isEmpty()) {
			errores.add("❌ La portada es obligatoria.");
		}

		// Si hay errores, se devuelven todos juntos
		if (!errores.isEmpty()) {
			return ResponseEntity.badRequest().body(errores);
		}

		return ResponseEntity.ok(libroService.guardar(libro));
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> actualizarLibro(@PathVariable Long id, @RequestBody Libro libroActualizado,
			@RequestParam String rol) {
		if (!"ADMIN".equalsIgnoreCase(rol)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("🚫 No tienes permisos para editar libros.");
		}

		List<String> errores = new ArrayList<>();

		if (libroActualizado.getTitulo() == null || libroActualizado.getTitulo().trim().isEmpty()) {
			errores.add("❌ El título es obligatorio.");
		}

		if (libroActualizado.getAutor() == null || libroActualizado.getAutor().trim().isEmpty()) {
			errores.add("❌ El autor es obligatorio.");
		}

		if (libroActualizado.getNacionalidadAutor() == null
				|| libroActualizado.getNacionalidadAutor().trim().isEmpty()) {
			errores.add("❌ La Nacionalidad del autor es obligatorio.");
		}

		if (libroActualizado.getAnioPublicacion() == null || libroActualizado.getAnioPublicacion() < 1500
				|| libroActualizado.getAnioPublicacion() > 2025) {
			errores.add("❌ Año de publicación inválido.");
		}

		if (libroActualizado.getGeneroLiterario() == null || libroActualizado.getGeneroLiterario().trim().isEmpty()) {
			errores.add("❌ El Género Literario es obligatorio.");
		}

		if (libroActualizado.getPrecio() == null || libroActualizado.getPrecio() <= 0) {
			errores.add("❌ El precio debe ser mayor a 0.");
		}

		if (libroActualizado.getFormato() == null || libroActualizado.getFormato().trim().isEmpty()) {
			errores.add("❌ El formato es obligatorio.");
		}

		if (libroActualizado.getAccesible() == null) {
			errores.add("❌ Debes indicar si el libro es accesible.");
		}

		if (libroActualizado.getTemaPrincipal() == null || libroActualizado.getTemaPrincipal().trim().isEmpty()) {
			errores.add("❌ El tema principal es obligatorio.");
		}

		if (libroActualizado.getPortada() == null || libroActualizado.getPortada().trim().isEmpty()) {
			errores.add("❌ La portada es obligatoria.");
		}

		if (!errores.isEmpty()) {
			return ResponseEntity.badRequest().body(errores);
		}

		return libroService.obtenerPorId(id).map(libro -> {
			libro.setTitulo(libroActualizado.getTitulo());
			libro.setAutor(libroActualizado.getAutor());
			libro.setNacionalidadAutor(libroActualizado.getNacionalidadAutor());
			libro.setAnioPublicacion(libroActualizado.getAnioPublicacion());
			libro.setGeneroLiterario(libroActualizado.getGeneroLiterario());
			libro.setPrecio(libroActualizado.getPrecio());
			libro.setFormato(libroActualizado.getFormato());
			libro.setAccesible(libroActualizado.getAccesible());
			libro.setTemaPrincipal(libroActualizado.getTemaPrincipal());
			libro.setPortada(libroActualizado.getPortada());
			return ResponseEntity.ok(libroService.guardar(libro));
		}).orElse(ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> eliminarLibro(@PathVariable Long id, @RequestParam String rol) {
		if (!"ADMIN".equalsIgnoreCase(rol)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("🚫 No tienes permisos para eliminar libros.");
		}
		return libroService.obtenerPorId(id).map(libro -> {
			libroService.eliminar(id);
			return ResponseEntity.ok().build();
		}).orElse(ResponseEntity.notFound().build());
	}

	@PostMapping("/libros/upload")
	public ResponseEntity<String> uploadImage(@RequestParam("image") MultipartFile file) {
		try {
			String folder = "uploads/";
			String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
			Path path = Paths.get(folder + filename);
			Files.createDirectories(path.getParent());
			Files.write(path, file.getBytes());
			return ResponseEntity.ok(filename);
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al subir imagen");
		}
	}

	@GetMapping("/categoria/{genero}")
	public List<Libro> buscarPorGenero(@PathVariable String genero) {
		if (genero.equalsIgnoreCase("ciencia-ficcion")) {
			genero = "ciencia ficción";
		}
		return libroService.obtenerPorGenero(genero);
	}

	@GetMapping("/buscar/titulo/{titulo}/categoria/{categoria}")
	public List<Libro> buscarPorTituloYCategoria(@PathVariable String titulo, @PathVariable String categoria) {
		return libroService.buscarPorTituloYCategoria(titulo, categoria);
	}

}
