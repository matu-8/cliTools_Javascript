#!/usr/bin/env node 
import * as fs from "node:fs";

//Creo un objeto donde se define la estructura de archivos
const projectStructure = {
    'src':['src/controllers', 'src/controller/user.controller.js'
    ],
       
};
const structureFileArray = Object.entries(projectStructure);

structureFileArray.forEach(([dir, files])=>{
    fs.mkdirSync(dir, {recursive:true})
    files.forEach((file)=>fs.writeFileSync(`${dir}/${file}`,''));
});
console.log(`La estructura del proyecto se creó con exito`)