// =====================================================
//   SISTEMA DE GESTIÓN DE CALIFICACIONES DE ALUMNOS
// =====================================================
// Ejecutar con: node cli_tools/gestion_alumnos.js
// =====================================================

import readline from "readline";

// -------------------------------------------------------
// ESTRUCTURA DE DATOS: Matriz multidimensional de alumnos
// Formato: [ [nombre, [ [materia, nota], ... ] ], ... ]
// -------------------------------------------------------
let alumnos = [
  ["Juan", [["Matematicas", 8], ["Lengua", 9], ["Sociales", 7], ["Naturales", 7]]],
  ["Ana", [["Lengua", 9], ["Matematicas", 10], ["Sociales", 8], ["Naturales", 6]]],
  ["Luis", [["Lengua", 6], ["Sociales", 8], ["Matematicas", 7], ["Naturales", 6]]],
  ["María", [["Lengua", 9], ["Sociales", 10], ["Naturales", 10], ["Matematicas", 9]]],
];

// Índices para facilitar la lectura del código
const I_NOMBRE = 0; // índice del nombre en cada alumno
const I_MATERIAS = 1; // índice de la lista de materias en cada alumno
const I_MATERIA = 0; // índice del nombre de la materia dentro de cada par
const I_NOTA = 1; // índice de la nota dentro de cada par

// -------------------------------------------------------
// INTERFAZ DE READLINE para entrada por consola
// -------------------------------------------------------
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Función auxiliar: pregunta algo y devuelve la respuesta como promesa
function preguntar(texto) {
  return new Promise((resolve) => {
    rl.question(texto, (respuesta) => {
      resolve(respuesta.trim());
    });
  });
}

// -------------------------------------------------------
// FUNCIONES AUXILIARES
// -------------------------------------------------------

// Busca un alumno por nombre (sin distinguir mayúsculas/minúsculas)
// Devuelve el índice dentro de 'alumnos', o -1 si no existe
function buscarAlumno(nombre) {
  for (let i = 0; i < alumnos.length; i++) {
    if (alumnos[i][I_NOMBRE].toLowerCase() === nombre.toLowerCase()) {
      return i;
    }
  }
  return -1;
}

// Busca una materia dentro de un alumno dado por su índice
// Devuelve el índice de la materia, o -1 si no existe
function buscarMateria(indiceAlumno, nombreMateria) {
  let materias = alumnos[indiceAlumno][I_MATERIAS];
  for (let j = 0; j < materias.length; j++) {
    if (materias[j][I_MATERIA].toLowerCase() === nombreMateria.toLowerCase()) {
      return j;
    }
  }
  return -1;
}

// Calcula el promedio de notas de un alumno dado por su índice
function calcularPromedio(indiceAlumno) {
  let materias = alumnos[indiceAlumno][I_MATERIAS];
  if (materias.length === 0) return 0;

  let suma = 0;
  for (let j = 0; j < materias.length; j++) {
    suma += materias[j][I_NOTA];
  }
  return suma / materias.length;
}

// -------------------------------------------------------
// OPCIÓN 1: MOSTRAR TODOS LOS ALUMNOS
// -------------------------------------------------------
function mostrarAlumnos() {
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║       LISTADO DE ALUMNOS Y NOTAS         ║");
  console.log("╚══════════════════════════════════════════╝");

  if (alumnos.length === 0) {
    console.log("  (No hay alumnos registrados)");
    return;
  }

  // Calculamos promedios para todos y los ordenamos de mayor a menor
  let alumnosConPromedio = [];
  for (let i = 0; i < alumnos.length; i++) {
    let promedio = calcularPromedio(i);
    alumnosConPromedio.push({ indice: i, promedio: promedio });
  }

  // Ordenar por promedio descendente (BONUS: ordenar por promedio)
  alumnosConPromedio.sort((a, b) => b.promedio - a.promedio);

  // Mostrar cada alumno ordenado
  for (let k = 0; k < alumnosConPromedio.length; k++) {
    let i = alumnosConPromedio[k].indice;
    let nombre = alumnos[i][I_NOMBRE];
    let materias = alumnos[i][I_MATERIAS];
    let promedio = alumnosConPromedio[k].promedio;

    console.log(`\n  Alumno: ${nombre}`);
    console.log("  ─────────────────────────────────");

    for (let j = 0; j < materias.length; j++) {
      let materia = materias[j][I_MATERIA];
      let nota = materias[j][I_NOTA];
      console.log(`    • ${materia.padEnd(15)} Nota: ${nota}`);
    }

    // BONUS: mostrar promedio
    console.log(`  ─────────────────────────────────`);
    console.log(`    Promedio: ${promedio.toFixed(2)}`);
  }

  // BONUS: mostrar el alumno con mejor promedio
  if (alumnosConPromedio.length > 0) {
    let mejorIndice = alumnosConPromedio[0].indice;
    let mejorNombre = alumnos[mejorIndice][I_NOMBRE];
    let mejorProm = alumnosConPromedio[0].promedio;
    console.log("\n  ⭐ Mejor promedio: " + mejorNombre + " (" + mejorProm.toFixed(2) + ")");
  }

  console.log("");
}

// -------------------------------------------------------
// OPCIÓN 2: AGREGAR UN ALUMNO NUEVO
// -------------------------------------------------------
async function agregarAlumno() {
  console.log("\n--- AGREGAR ALUMNO ---");

  let nombre = await preguntar("  Nombre del alumno: ");

  if (nombre === "") {
    console.log("  El nombre no puede estar vacío.");
    return;
  }

  // Validar si el alumno ya existe
  let indice = buscarAlumno(nombre);
  if (indice !== -1) {
    console.log(`  ⚠️  El alumno "${alumnos[indice][I_NOMBRE]}" ya está registrado.`);
    // Redirigir a agregar/modificar notas
    await gestionarNotas(indice);
    return;
  }

  // El alumno no existe: pedimos materias y notas
  let materias = [];
  console.log('  Ingrese las materias y notas (escriba "fin" para terminar):');

  while (true) {
    let nombreMateria = await preguntar("    Materia (o 'fin'): ");

    if (nombreMateria.toLowerCase() === "fin") {
      break;
    }

    if (nombreMateria === "") {
      console.log("    El nombre de la materia no puede estar vacío.");
      continue;
    }

    let notaStr = await preguntar(`    Nota para ${nombreMateria}: `);
    let nota = parseFloat(notaStr);

    if (isNaN(nota) || nota < 0 || nota > 10) {
      console.log("    Nota inválida. Debe ser un número entre 0 y 10.");
      continue;
    }

    materias.push([nombreMateria, nota]);
    console.log(`    ✔ ${nombreMateria}: ${nota} agregada.`);
  }

  // Agregar el nuevo alumno a la matriz
  alumnos.push([nombre, materias]);
  console.log(`  ✅ Alumno "${nombre}" agregado con ${materias.length} materia(s).`);
}

// -------------------------------------------------------
// OPCIÓN 3: AGREGAR O MODIFICAR NOTA DE UN ALUMNO
// -------------------------------------------------------
async function opcionAgregarModificarNota() {
  console.log("\n--- AGREGAR O MODIFICAR NOTA ---");

  let nombre = await preguntar("  Nombre del alumno: ");

  let indice = buscarAlumno(nombre);
  if (indice === -1) {
    console.log(`  ⚠️  El alumno "${nombre}" no está registrado.`);
    let resp = await preguntar("  ¿Desea agregarlo como nuevo alumno? (s/n): ");
    if (resp.toLowerCase() === "s") {
      await agregarAlumno(); // reutilizamos la función de agregar
    }
    return;
  }

  await gestionarNotas(indice);
}

// -------------------------------------------------------
// FUNCIÓN COMPARTIDA: Gestionar notas de un alumno
// -------------------------------------------------------
async function gestionarNotas(indiceAlumno) {
  let nombre = alumnos[indiceAlumno][I_NOMBRE];
  let materias = alumnos[indiceAlumno][I_MATERIAS];

  console.log(`\n  Materias actuales de ${nombre}:`);
  for (let j = 0; j < materias.length; j++) {
    console.log(`    ${j + 1}. ${materias[j][I_MATERIA]}: ${materias[j][I_NOTA]}`);
  }

  let nombreMateria = await preguntar("\n  Nombre de la materia a agregar/modificar: ");

  if (nombreMateria === "") {
    console.log("  Operación cancelada.");
    return;
  }

  let indiceMateria = buscarMateria(indiceAlumno, nombreMateria);
  let notaStr = await preguntar("  Nueva nota (0-10): ");
  let nota = parseFloat(notaStr);

  if (isNaN(nota) || nota < 0 || nota > 10) {
    console.log("  Nota inválida. Debe ser un número entre 0 y 10.");
    return;
  }

  if (indiceMateria !== -1) {
    // La materia ya existe: modificar la nota
    let notaAnterior = materias[indiceMateria][I_NOTA];
    materias[indiceMateria][I_NOTA] = nota;
    console.log(`  ✅ Nota de "${materias[indiceMateria][I_MATERIA]}" actualizada: ${notaAnterior} → ${nota}`);
  } else {
    // La materia no existe: agregarla
    materias.push([nombreMateria, nota]);
    console.log(`  ✅ Materia "${nombreMateria}" con nota ${nota} agregada a ${nombre}.`);
  }
}

// -------------------------------------------------------
// MENÚ PRINCIPAL
// -------------------------------------------------------
async function mostrarMenu() {
  console.log("\n╔══════════════════════════════╗");
  console.log("║   GESTIÓN DE CALIFICACIONES  ║");
  console.log("╠══════════════════════════════╣");
  console.log("║  1. Ver alumnos              ║");
  console.log("║  2. Agregar alumno           ║");
  console.log("║  3. Agregar o modificar nota ║");
  console.log("║  4. Salir                    ║");
  console.log("╚══════════════════════════════╝");
}

// -------------------------------------------------------
// BUCLE PRINCIPAL DEL PROGRAMA
// -------------------------------------------------------
async function iniciar() {
  console.log("\n  Bienvenido al Sistema de Gestión de Calificaciones");

  let continuar = true;

  while (continuar) {
    await mostrarMenu();
    let opcion = await preguntar("  Seleccione una opción: ");

    switch (opcion) {
      case "1":
        mostrarAlumnos();
        break;

      case "2":
        await agregarAlumno();
        break;

      case "3":
        await opcionAgregarModificarNota();
        break;

      case "4":
        console.log("\n  ¡Hasta luego!\n");
        continuar = false;
        break;

      default:
        console.log("  Opción inválida. Elija entre 1 y 4.");
    }
  }

  rl.close();
}

// Punto de entrada
iniciar();
