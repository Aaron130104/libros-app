package org.upn.edu.pe.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.upn.edu.pe.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long>{
	
    Optional<Usuario> findByCorreo(String correo);

}
