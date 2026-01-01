# Herramienta de Linea de Comandos Para Automatizar Configuracion de Proyectos
Lo que se realiza con esta practica es una automatizacion para setear de manera rapida un proyecto de programacion, mediante la libreria de node.js File System, y javascript.  
---
## Anotaciones de Desarrollo
**Shebang, primera linea del archivo ejecutable**: Es una expresion que indica al sistema operativo, que herramienta utilizar para poder ejecutar el archivo.

**File System**: Es la librería que con la que cuenta node.js para el manejo de directorios y archivos del sistema.

 **Funcion forEach**: Es una funcion que ejecuta el codigo que contenga dentro de la misma, por cada elemento de un arreglo, para el que se quiera que se ejecute la funcion.

 **Object.entries**: Es un metodo del tipo de dato objeto, el cual permite convertir un objeto a un arreglo con las propiedades pasadas a pares de clave-valor.  
---
>[!NOTE]
>**Pasos Realizar el Testeo de la Herramienta**:  
>1:Checkear las versiones de node y npm, que sean las utlimas y estables.  
>2:Crear un enlace global utilizando npm link, lo que permitira realizar pruebas.  
>3:Ejecutar  el comando predefinido en el archivo package.json, en el apartado de "bin".

```javascript
/*PASOS EN CONSOLA:
Verificacion de versiones de node y npm:
*/

npm -v
node -v

/*En el caso de que no se cuenten con las utlimas versiones, relizar lo siguiente
utilizando la gestion de versiones de node (nvm).
*/
nvm install --lts
//De ser necesario ejecutar el siguiente comando para tener la ultima version de npm.

nvm install-latest-npm

//Realizar enlace global

npm link

//Ejecutar el comando predefinido en archivo package.json, apartado "bin"

"bin": {
    "autoset-project": "index.js"
  }
