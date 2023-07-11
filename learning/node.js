// Con la instalación de node, se agregan dos principales ejecutables: node y npm

// Node es nuestro compilador y ejecutor de codigo (lo que corre el codigo):

// En cualquier terminal, haciendo "node" se abre una subterminal para poder correr codigo
// de NodeJS (recordemos que la sintaxis es similar a la de Javacscript con algunas diferencias)

// En cuaquier terminal haciendo "node el/path/a/un/codigo.js" ejecuta ese codigo.js bajo
// el compilador de NodeJS


// NPM: Node Package Manager, el instalador/gestor de paquetes/librerías/modulos de NodeJS. Existen nuevos
// gestor, con mejores características, pero NPM se usa bastante porque viene por default
// Además con "npm init" inicializamos una carpeta para que haga de nuestro directorio de backend.
// Una vez inicializado usamos "npm i (nombreDePaquete)" para instalar el paquete de npm con el nombre nombreDePaquete.
// Una variante es "npm install (nombreDePaquete)"
// Si hacemos sólo "npm i" ó "npm install" instalará todos los paquetes que esten listados en package.json

// Una vez que un módulo está instalado, se puede importar con "require"
// const NombreInternoDelPaquete = require("NombrePublicoDelPaquete")
// Esto es equivalente a, por ejemplo, el "import NombrePublicoDelPaquete as NombreInternoDelPaquete" de python