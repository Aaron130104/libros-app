package org.upn.edu.pe.controller;

import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.upn.edu.pe.dto.UsuarioLoginDTO;
import org.upn.edu.pe.model.Usuario;
import org.upn.edu.pe.service.UsuarioService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
	
	@Autowired
    private UsuarioService usuarioService;

	@PostMapping("/login")
	public ResponseEntity<Map<String, String>> login(@RequestBody UsuarioLoginDTO loginDTO) {

	    if (loginDTO.getCorreo() == null || loginDTO.getCorreo().isEmpty() ||
	        loginDTO.getClave() == null || loginDTO.getClave().isEmpty()) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	            .body(Map.of("mensaje", "Correo y contraseña son obligatorios"));
	    }
	    
	 // Validación de formato de correo
	    if (!Pattern.matches("^[\\w-.]+@[\\w-]+\\.[a-zA-Z]{2,}$", loginDTO.getCorreo())) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	            .body(Map.of("mensaje", "Formato de correo inválido"));
	    }

	    Optional<Usuario> usuarioOpt = usuarioService.findByCorreo(loginDTO.getCorreo().trim());

	    if (!usuarioOpt.isPresent()) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	            .body(Map.of("mensaje", "El usuario no existe"));
	    }

	    Usuario usuario = usuarioOpt.get();

	    if (!usuario.getClave().trim().equals(loginDTO.getClave().trim())) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	            .body(Map.of("mensaje", "Contraseña incorrecta"));
	    }

	    return ResponseEntity.ok(Map.of(
	    	  "mensaje", "✅ Login exitoso",
	    	  "correo", usuario.getCorreo(),
	    	  "rol", usuario.getRol()
	    ));	}
	
	@PostMapping("/registrar")
	public ResponseEntity<?> registrar(@RequestBody UsuarioLoginDTO nuevoUsuario) {

	    if (nuevoUsuario.getCorreo() == null || nuevoUsuario.getClave() == null) {
	        return ResponseEntity.badRequest().body(Map.of("mensaje", "Todos los campos son obligatorios"));
	    }

	    // Validar correo
	    if (!Pattern.matches("^[\\w-.]+@[\\w-]+\\.[a-zA-Z]{2,}$", nuevoUsuario.getCorreo())) {
	        return ResponseEntity.badRequest().body(Map.of("mensaje", "Correo inválido"));
	    }

	    // Validar si ya existe
	    Optional<Usuario> existente = usuarioService.findByCorreo(nuevoUsuario.getCorreo());
	    if (existente.isPresent()) {
	        return ResponseEntity.badRequest().body(Map.of("mensaje", "El usuario ya existe"));
	    }

	    Usuario usuario = new Usuario();
	    usuario.setCorreo(nuevoUsuario.getCorreo());
	    usuario.setClave(nuevoUsuario.getClave()); // (OJO: sin encriptar de momento)
	    usuario.setRol(nuevoUsuario.getRol() != null ? nuevoUsuario.getRol() : "USER");

	    usuarioService.guardar(usuario);

	    return ResponseEntity.ok(Map.of("mensaje", "✅ Usuario registrado exitosamente"));
	}
	
}
