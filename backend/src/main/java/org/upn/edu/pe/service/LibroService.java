package org.upn.edu.pe.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.upn.edu.pe.model.Libro;
import org.upn.edu.pe.repository.LibroRepository;

@Service
public class LibroService {
	
	@Autowired
    private LibroRepository libroRepository;

    public List<Libro> listarTodos() {
        return libroRepository.findAll();
    }
    
    public List<Libro> buscarPorTitulo(String titulo) {
        return libroRepository.findByTituloContainingIgnoreCase(titulo);
    }

    public List<Libro> buscarPorAutor(String autor) {
        return libroRepository.findByAutorContainingIgnoreCase(autor);
    }

    public Optional<Libro> obtenerPorId(Long id) {
        return libroRepository.findById(id);
    }

    public Libro guardar(Libro libro) {
        return libroRepository.save(libro);
    }

    public void eliminar(Long id) {
        libroRepository.deleteById(id);
    }
    
    public List<Libro> obtenerPorGenero(String genero) {
        return libroRepository.findByGeneroLiterarioIgnoreCase(genero.trim());
    }
    
    public List<Libro> buscarPorTituloYCategoria(String titulo, String categoria) {
        return libroRepository.findByTituloContainingIgnoreCaseAndGeneroLiterarioIgnoreCase(titulo, categoria);
    }
}
