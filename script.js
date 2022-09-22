
let option = {}
let peopleObj = {}
let idIndex = 0
let currentPerson = ''

class Person {
    name = ''
    age = ''
    SIN = ''
    zodiac = ''
    personality = ''

    constructor(_name, _age, _SIN, _zodiac) {
        this.name = _name
        this.age = _age
        this.SIN = _SIN
        this.zodiac = _zodiac
       
        /*
        const option = {
            'Áries': 'Maluco',
            'Touro': 'Esfomeado',
            'Gêmeos': 'Lerdo',
            'Câncer': 'Agitado',
            'Leão': 'Vaidoso',
            'Virgem': 'Calmo',
            'Libra': 'Inteligente',
            'Escorpião': 'Bravo',
            'Sagitário': 'Explorador',
            'Capricórnio': 'Aventureiro',
            'Aquário': 'Concentrado',
            'Peixes': 'Teimoso'
        }
        */

       this.personality = option[this.zodiac]
    }

}

//=========
//FUNCTIONS
//========
window.addEventListener('load', event => {
    clearInfo()

    fetch('https://raw.githubusercontent.com/dariusk/corpora/master/data/divination/zodiac.json')
        .then((response) => response.json())
        .then((data) => {

           
            /*Getting the key values from the JSON file and also the first element from an array of personality traces*/
            const zodiac = Object.keys(data.western_zodiac)
            const keywords = data.western_zodiac.Aquarius.keywords[0]
            const randomNum = Math.floor(Math.random() * 3)

            //Building object with the zodiac name as key, and one of the 3 personality traces in the keywords array for that zodiac.
            zodiac.forEach((element, i) => {
                const personalityWord = data.western_zodiac[zodiac[i]].keywords[randomNum]
                Object.assign(option, { [zodiac[i]]: personalityWord[0].toUpperCase() + personalityWord.substring(1) })
            });

            //Building the select dynamically
            let select = document.getElementById("zodiac");
            for (const key in option) {     
                let optionElement = document.createElement("option");
                optionElement.text = key
                select.add(optionElement)       
            }
    });

})

const saveInfo = () => {
    const name = document.getElementById('name').value
    const age = document.getElementById('age').value
    const SIN = document.getElementById('SIN').value
    const zodiac = document.getElementById('zodiac').value
    const person = new Person(name, age, SIN, zodiac)

    //Checks
    if (name.length === 0 || age.length === 0 ||
        SIN.length === 0 || zodiac.length === 0){
        alert('Please fill all fields')
        return
    }

    if(!+age || !+SIN){
        alert('Please type numbers only for AGE and SIN.')
        return
    }

    //Getting the current item id
    const randomId = Math.random()

    //Adding person to the literal object of people
    peopleObj[randomId] = {
         name: person.name,
         age: person.age,
         SIN: person.SIN,
         zodiac: person.zodiac,
         personality: person.personality
         };

    const personList = document.getElementById('personList')
    personList.innerHTML += `<span id="${randomId}">Name: ${person.name}<br>
    Age: ${person.age}<br>
    SIN: ${person.SIN}<br>
    Zodiac: ${person.zodiac}<br>
    Personality: ${person.personality + " "}<br>
    <button id="${randomId}" onclick="deletePerson(this)">Delete</button><br>
    <button id="${randomId}" onclick="editPerson(this)">Edit</button></span><br>`

    //Cleaning the fields
    clearInfo()
    
}

const clearInfo = () => {
    //Cleaning the fields
    document.getElementById('name').value = ''
    document.getElementById('age').value = ''
    document.getElementById('SIN').value = ''
    document.getElementById('zodiac').value = 'Choose an option'
}

const deletePerson = (event) => {

    const id = event.id
    document.getElementById(id).remove();
    delete peopleObj[id]

    alert("Person deleted!");

}

const editPerson = (event) => {
    //getting currentPerson to edit
    currentPerson = event

    document.getElementById("modal").style.display = 'block'

    document.getElementById('nameEdit').value = peopleObj[event.id].name
    document.getElementById('ageEdit').value = peopleObj[event.id].age
    document.getElementById('SINEdit').value = peopleObj[event.id].SIN

    //Building the select dynamically
    let select = document.getElementById("zodiacEdit");
    for (const key in option) {
        let optionElement = document.createElement("option");
        optionElement.text = key
        select.add(optionElement)
    }

    document.getElementById('zodiacEdit').value = peopleObj[event.id].zodiac

}

const editConfirm = () => {

    //Updating object
    peopleObj[currentPerson.id].name = document.getElementById('nameEdit').value
    peopleObj[currentPerson.id].age = document.getElementById('ageEdit').value
    peopleObj[currentPerson.id].SIN = document.getElementById('SINEdit').value
    peopleObj[currentPerson.id].zodiac = document.getElementById('zodiacEdit').value
    peopleObj[currentPerson.id].personality = option[peopleObj[currentPerson.id].zodiac]

    let newName = peopleObj[currentPerson.id].name
    let newAge = peopleObj[currentPerson.id].age
    let newSIN = peopleObj[currentPerson.id].SIN
    let newZodiac = peopleObj[currentPerson.id].zodiac
    let newPersonality = peopleObj[currentPerson.id].personality

      //Updating HTML
    console.log(document.getElementById(currentPerson.id))
    document.getElementById(currentPerson.id).outerHTML = `<span id="${currentPerson.id}">Name: ${newName}<br>
    Age: ${newAge}<br>
    SIN: ${newSIN}<br>
    Zodiac: ${newZodiac}<br>
    Personality: ${newPersonality}<br>
    <button id="${currentPerson.id}" onclick="deletePerson(this)">Delete</button><br>
    <button id="${currentPerson.id}" onclick="editPerson(this)">Edit</button></span><br>`

    closeModal()
}

const closeModal = () => {
    document.getElementById("modal").style.display = 'none'
}

const search = () => {

    if (Object.keys(peopleObj).length > 0) {
        input = document.getElementById('searchInput');
        filter = input.value.toUpperCase();
        list = document.getElementById("personList");

        var regex = new RegExp(filter, "i");
  
        console.log(peopleObj)

         for (let index = 0; index < Object.keys(peopleObj).length; index++) {   
             const name = Object.values(peopleObj).map(e => e.name)[index]
             const id = Object.keys(peopleObj)[index]
             
             if (name.search(regex) === -1){
                document.getElementById(id).style.display = 'none'
             }
             else{
                 document.getElementById(id).style.display = 'block'
             }
                                  
        };


    }

}




