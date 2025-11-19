package org.upn.edu.pe.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.upn.edu.pe.model.Usuario;
import org.upn.edu.pe.repository.UsuarioRepository;

@Service
public class UsuarioService {

	@Autowired
	private UsuarioRepository repo;

	public Optional<Usuario> findByCorreo(String correo) {
		return repo.findByCorreo(correo);
	}

	public Usuario guardar(Usuario usuario) {
		return repo.save(usuario);
	}

	public String registrarUsuario(Usuario usuario) {
		Optional<Usuario> existente = repo.findByCorreo(usuario.getCorreo().trim());

		if (existente.isPresent()) {
			return "El correo ya está registrado";
		}

		usuario.setRol("USUARIO"); // o "CLIENTE" si prefieres
		repo.save(usuario);
		return "Registrado exitosamente";
	}

}
