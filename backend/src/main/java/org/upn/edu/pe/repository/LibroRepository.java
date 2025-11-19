package org.upn.edu.pe.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.upn.edu.pe.model.Libro;

@Repository
public interface LibroRepository extends JpaRepository<Libro, Long> {
	
	List<Libro> findByTituloContainingIgnoreCase(String titulo);
	List<Libro> findByAutorContainingIgnoreCase(String autor);
	List<Libro> findByGeneroLiterarioIgnoreCase(String generoLiterario);
	List<Libro> findByTituloContainingIgnoreCaseAndGeneroLiterarioIgnoreCase(String titulo, String generoLiterario);


}
