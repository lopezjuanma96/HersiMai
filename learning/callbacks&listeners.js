// Callbacks: Son funciones que se pasan como parámetros a otras funciones.
// Entonces se ejecutan cuando la función que las recibe ("padre") las ejecuta.

// Ejemplo más común: setTimeout
// setTimeout es una función que recibe dos parámetros: una función (callback) y un tiempo en milisegundos.
// El callback que recibe como parámetro se ejecuta cuando se cumple el tiempo indicado.

// Pasando el callback como función nombrada

function ImprimirHola(){
    console.log("Hola")
}

setTimeout(ImprimirHola, 2000) // Imprime "Hola" luego de 2 segundos

// Pasando el callback como función anónima

setTimeout(() => {console.log("Hola")}, 2000) // Imprime "Hola" luego de 2 segundos

// Otro ejemplo: maps
// Los maps son métodos de los arrays que reciben como parámetro una función (callback) y la ejecutan por cada elemento del array.

const array = [1, 2, 3, 4, 5]

// Pasando el callback como función nombrada

function MultiplicarPorDos(valor){
    return valor * 2
}

const arrayMultiplicadoPorDos = array.map(MultiplicarPorDos)

console.log(arrayMultiplicadoPorDos) // Imprime [2, 4, 6, 8, 10]

// Pasando el callback como función anónima

const arrayMultiplicadoPorDos2 = array.map((valor) => {return valor * 2})

console.log(arrayMultiplicadoPorDos2) // Imprime [2, 4, 6, 8, 10]

// Otros ejemplos: filter, find, forEach, etc.

// Listeners: Son funciones que se ejecutan cuando se produce un evento (principalmente referido a eventos del DOM: clicks, tecleado, etc.)
// Para asignar un listener a un evento, se usa el método addEventListener del elemento HTML que queremos escuchar.
// Este método recibe dos parámetros: el nombre del evento y el callback que se ejecuta cuando se produce el evento.
// El callback que se pasa como parámetro recibe como parámetro el evento que se produjo.

// Ejemplo: asignar un listener al evento click de un botón

// Primero seleccionamos el elemento HTML
const boton = document.getElementById("boton") // Asumimos que hay un boton con id "boton"

// Luego le asignamos el listener
// Agregando el callback como función nombrada
function ImprimirHola(e){
    console.log("Hola")
}

boton.addEventListener("click", ImprimirHola)

// Agregando el callback como función anónima
boton.addEventListener("click", (e) => {console.log("Hola")})