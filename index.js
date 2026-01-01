#!/usr/bin/env node 
//Esto es una shebang, es una linea que indica a sistema operativo que herramienta utilizar para ejecutar el archivo

//importacion del modulo de file system de node.
import * as fs from "node:fs";
//Creo un objeto donde se define la estructura de archivos
const projectStructure = {
    'src':['index.js'],
    'public':['index.html', 'style.css']
};
const structureFileArray = Object.entries(projectStructure);

structureFileArray.forEach(([dir, files])=>{
    fs.mkdirSync(dir, {recursive:true})
    files.forEach((file)=>fs.writeFileSync(`${dir}/${file}`,''));
});
console.log(`La estructura del proyecto se creó con exito`)