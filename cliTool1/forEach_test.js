const namesArray = {
    name1:'Matias',
    name2:'Juan',
    name3:'Benja'
};

const passedNames = Object.entries(namesArray); //Object es el tipo de dato complejo, el cual tiene un metodo llamado entries, el cual permite convertir el objeto a un arreglo con las propiedades clave valor
passedNames.forEach((names)=>console.log(names))