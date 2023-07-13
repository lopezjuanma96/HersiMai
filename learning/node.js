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

// ENDPOINTS:
// Son las distintas localizaciones a las que podemos acceder dentro de un mismo backend. 
// Cada localización podría tener una función distinta.

// Ejemplos:
//      youtube.com -> endpoint en el path vacío o también "/", muestra home
//      youtube.com/watch -> endpoint en el path "/watch", muestra un video
//      youtube.com/results -> endpoint en el path "/results", muestra resultados de busqueda 

// En un principio se trataba de ahorrar lo más posible, entonces se inventaron "tipos"
// de endpoint para que un mismo path funcionara para distintas cosas:
//      - GET: Obtiene información, es el default de la URL de los navegadores.
//      - POST: Crea información
//      - PUT: Actualizar información
//      - DELETE: Elimina información
// Entonces, p ej, vos tendrías el mismo endpoint "universidad.com/examenes" que si lo accedías
// como GET te listaba los examenes, si lo accedias como POST podías agregar un examen,
// como PUT podías modificar un examen y como DELETE podías elimarlo.
// Hoy ya no es necesario y hasta a veces redundante pero se mantiene:
//      universidad.com/examenes/listar y le pone GET
//      universidad.com/examenes/crear y le pone POST

// En express, para definir un path uso el objeto app (o el router) y accedo al comando del tipo
// de endpoint correspondiente y le paso:
//          - un string, el path del endpoint
//          - un callback con los objetos req y res como parametros que representan a la request y la response

// REQUEST: todo lo que tiene que ver con lo que el cliente PIDE o MANDA
// RESPONSE: todo lo que tiene que ver con lo que el servidor DEVUELVE

// ej: app.get("/examenes/listar", (req, res) => {...})

// MIDDLEWARES:
// con app.use de express podemos aplicar middlewares que se ejecutan antes de nuestro endpoint.