// Métodos / Funciones: Son los que permiten realizar acciones repetitivas.
// Para pensar las funciones hay que pensar en una caja que recibe un input, lo procesa, realiza cambios, y devuelve un output

// Definición básica de funciones: anteponiendo la palabra clave "function" antes del nombre de la funcion,
// los inputs entre paréntesis separados por coma, el procesamiento entre llaves y los outputs con la palabra clave "return" antepuesta
function SumaDosValores(valor1, valor2){
    const resultado = valor1 + valor2;
    return resultado
}

console.log(SumaDosValores(1, 2))
console.log(SumaDosValores(3.5, 9))

// Definición flecha: se usa mucho en funciones anónimas pero también se puede asignar a una variable.
// los inputs se escriben entre paréntesis, se separan de las llaves de procesamiento con una flecha "=>" y el resto es igual.
console.log(() => {return "hola"}) //la funcion se crea en el momento de pasarla al console.log y luego desaparece

const RetornaHola = () => {return "hola"} //si la asigno a una variable deja de ser anónima.
function TambiénRetornaHola(){ //esto es equivalente a la de arriba
    return "hola";
}

console.log(RetornaHola())
console.log(TambiénRetornaHola())

// Reescribamos la suma como función flecha
const TambiénSumaDosValores = (valor1, valor2) => {
    const resultado = valor1 + valor2;
    return resultado
}

console.log(TambiénSumaDosValores(1, 2))
console.log(TambiénSumaDosValores(3.5, 9))

// Las funciones flecha con una única línea pueden obviar las llaves y el return.
// Esto quiere decir que a la función RetornaHola la puedo escribir como
const RetornaHolaUnaLínea = () => "hola"
console.log(RetornaHolaUnaLínea())

// esto no lo podemos hacer en SumaDosValores, a menos que reduzcamos la cantidad de líneas (esto no siempre se puede)
const SumaDosValoresUnaLínea = (valor1, valor2) => {return valor1 + valor2} //ahí nos quedó en una sola línea
const SumaDosValoresUnaLínea2 = (valor1, valor2) => valor1 + valor2 //ahí nos quedó en una sola línea

console.log(SumaDosValoresUnaLínea(1, 2))
console.log(SumaDosValoresUnaLínea(3.5, 9))
console.log(SumaDosValoresUnaLínea2(1, 2))
console.log(SumaDosValoresUnaLínea2(3.5, 9))
