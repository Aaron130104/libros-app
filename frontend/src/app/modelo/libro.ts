export class Libro {  // Clase que representa un modelo de libro en Angular

    id!: number;            // Identificador del libro
    titulo!: string;        // Título del libro
    autor!: string;         // Autor del libro
    nacionalidadAutor?: string;   
    anioPublicacion?: number;
    generoLiterario?: string;
    precio!: number;        // Precio del libro
    formato!: string;       // Formato del libro: PDF, etc.
    accesible!: boolean;    // Si es accesible para personas con discapacidad
    temaPrincipal?: string;
    portada?: string; // nuevo campo

    constructor() {}        // Constructor vacío
}