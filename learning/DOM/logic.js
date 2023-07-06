//DOM: El modelo de objeto de documento (DOM) es una interfaz de programación para los documentos HTML y XML. https://developer.mozilla.org/es/docs/Web/API/Document_Object_Model/Introduction
//Se accede al DOM con la palabra clave "document"

console.log(document.getElementById("temp"))
console.log(document.getElementById("temp").children)

document.getElementById("temp").innerHTML += '<div class="col-2 bgBlue">b</div>'

//Mejor aprovechemos la posibilidad de crear variables y constantes
//Estas se crean anteponiendo la palabra "var"/"let" y "const", respectivamente, al nombre de la variable

const tempElement = document.getElementById("temp")
console.log(tempElement)
console.log(tempElement.children)
tempElement.innerHTML += '<div class="col-2 bgBlue">b</div>'

// A las constantes no se les puede volver a asignar un valor, son constantes
// tempElement = document.getElementById("temp2")

var suma = 1;
console.log(suma);
suma = 3;
console.log(suma);
suma += 2 //Equivalente suma = suma + 2
console.log(suma);
suma ++; //Equivalente a suma += 1
console.log(suma);
