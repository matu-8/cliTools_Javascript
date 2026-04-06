# Documentación – Sistema de Gestión de Calificaciones

> **Trabajo Práctico 4 – Seminario de Actualización**  
> Archivo: `cli_tools/gestion_alumnos.js`  
> Ejecución: `node cli_tools/gestion_alumnos.js`

---

## ¿Qué hace el programa?

Es un programa de consola escrito en **JavaScript (Node.js)** que permite gestionar calificaciones de alumnos. El usuario puede:

1. **Ver** todos los alumnos con sus materias, notas y promedio.
2. **Agregar** un alumno nuevo con sus materias y notas.
3. **Agregar o modificar** una nota de un alumno existente.
4. **Salir** del programa.

Además, incluye los tres **bonus** solicitados:
- Calcula el promedio de cada alumno.
- Muestra el alumno con mejor promedio.
- Lista los alumnos ordenados de mayor a menor promedio.

---

## Estructura de datos elegida

El enunciado exigía usar **matrices multidimensionales** (listas dentro de listas), sin bases de datos. Se utilizó exactamente el formato indicado:

```js
let alumnos = [
  ["Juan",  [["Matematicas", 8], ["Lengua", 9], ...]],
  ["Ana",   [["Lengua", 9],  ["Matematicas", 10], ...]],
  ...
];
```

Cada elemento de `alumnos` es un arreglo de dos posiciones:
- `[0]` → nombre del alumno (`string`)
- `[1]` → arreglo de materias, donde cada materia es `[nombreMateria, nota]`

### ¿Por qué este formato y no objetos `{}`?

El enunciado lo exige explícitamente. Sin embargo, para facilitar la **lectura del código** se definieron constantes de índices al principio del archivo:

```js
const I_NOMBRE   = 0; // índice del nombre en cada alumno
const I_MATERIAS = 1; // índice de la lista de materias
const I_MATERIA  = 0; // índice del nombre dentro de cada par materia-nota
const I_NOTA     = 1; // índice de la nota dentro de cada par
```

Esto evita usar números "mágicos" como `alumnos[i][1][j][0]` y hace el código más legible sin violar la restricción de usar matrices.

---

## Decisiones técnicas tomadas

### 1. `readline` con Promesas (`async/await`)

Node.js no tiene una función `input()` como Python. La forma estándar de leer del teclado es con el módulo `readline`, que trabaja con **callbacks** (funciones que se llaman cuando el usuario termina de escribir).

Se creó una función auxiliar `preguntar()` que convierte ese callback en una **Promesa**, lo que permite usar `async/await` y escribir el menú de forma secuencial y legible:

```js
function preguntar(texto) {
  return new Promise((resolve) => {
    rl.question(texto, (respuesta) => resolve(respuesta.trim()));
  });
}
```

**Alternativa descartada:** usar callbacks anidados ("callback hell") o una librería externa. Se optó por la solución nativa para mantener la simplicidad y no requerir `npm install`.

---

### 2. Búsqueda por nombre sin sensibilidad a mayúsculas

Las funciones `buscarAlumno()` y `buscarMateria()` comparan los nombres usando `.toLowerCase()` en ambos lados:

```js
if (alumnos[i][I_NOMBRE].toLowerCase() === nombre.toLowerCase()) { ... }
```

**Motivo:** evitar que el usuario no encuentre a "Juan" porque escribió "juan" o "JUAN". Es una validación mínima pero importante para la usabilidad en consola.

---

### 3. Reutilización de funciones entre opciones del menú

Las opciones 2 y 3 del menú comparten lógica: ambas pueden terminar modificando notas. Se separó esa lógica en una función independiente `gestionarNotas(indiceAlumno)`:

- La **opción 2** (agregar alumno) llama a `gestionarNotas()` si detecta que el alumno ya existe.
- La **opción 3** (modificar nota) llama directamente a `gestionarNotas()` después de identificar al alumno.

Esto evita duplicar código y facilita futuras modificaciones.

---

### 4. Cálculo y visualización del promedio (Bonus)

Se creó la función `calcularPromedio(indiceAlumno)` que itera las materias del alumno y devuelve la media aritmética simple:

```js
function calcularPromedio(indiceAlumno) {
  let materias = alumnos[indiceAlumno][I_MATERIAS];
  let suma = 0;
  for (let j = 0; j < materias.length; j++) {
    suma += materias[j][I_NOTA];
  }
  return suma / materias.length;
}
```

### 5. Ordenamiento por promedio (Bonus)

Antes de mostrar la lista, se construye un arreglo auxiliar con el índice y el promedio de cada alumno, y se ordena con `.sort()`:

```js
alumnosConPromedio.sort((a, b) => b.promedio - a.promedio);
```

Se usó un arreglo auxiliar para **no modificar el arreglo original** `alumnos`, manteniendo los datos intactos pero mostrándolos en orden diferente.

---

### 6. Validación de notas

Al ingresar una nota siempre se valida con:

```js
let nota = parseFloat(notaStr);
if (isNaN(nota) || nota < 0 || nota > 10) { ... }
```

Se usa `parseFloat` (y no `parseInt`) para permitir notas decimales como `7.5`.

---

## Estructura del archivo

| Sección | Descripción |
|---|---|
| Líneas 1–11 | Encabezado, imports y datos iniciales |
| Líneas 13–19 | Constantes de índices |
| Líneas 22–30 | Configuración de `readline` y función `preguntar()` |
| Líneas 33–82 | Funciones auxiliares: `buscarAlumno`, `buscarMateria`, `calcularPromedio` |
| Líneas 85–130 | Opción 1: `mostrarAlumnos()` |
| Líneas 133–170 | Opción 2: `agregarAlumno()` |
| Líneas 173–195 | Opción 3: `opcionAgregarModificarNota()` |
| Líneas 198–230 | Función compartida: `gestionarNotas()` |
| Líneas 233–250 | `mostrarMenu()` |
| Líneas 253–285 | Bucle principal `iniciar()` |
| Última línea | Punto de entrada: `iniciar()` |

---

## Cómo ejecutar el programa

1.Clonar del repositorio, la rama 'tpcli_seminario'
2.Iniciar un terminal en la carpeta del repositorio, o navegar en directorios hasta la misma.
3. Ejecutar el siguiente comando en consola:
```bash
node cli_tools/gestion_alumnos.js
```
No requiere instalar dependencias externas. Solo necesita **Node.js** instalado en el sistema.

---

## Posibles mejoras futuras

- Persistencia de datos: guardar y cargar desde un archivo `.json` con `fs.readFileSync` / `fs.writeFileSync`.
- Validar que no se agregue la misma materia dos veces al agregar un alumno nuevo.
- Agregar opción para eliminar un alumno o una materia.
- Mostrar tabla formateada con anchos de columna fijos para mejor legibilidad.
