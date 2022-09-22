
let option = {}

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

       this.personality = option[this.zodiac][0]
    }

}

window.addEventListener('load', event => {
    fetch('https://raw.githubusercontent.com/dariusk/corpora/master/data/divination/zodiac.json')
        .then((response) => response.json())
        .then((data) => {
            /*Getting the key values from the JSON file and also the first element from an array of personality traces*/
            const zodiac = Object.keys(data.western_zodiac)
            const keywords = data.western_zodiac.Aquarius.keywords[0]
            const randomNum = Math.floor(Math.random() * 3)

            //Building object with the zodiac name as key, and one of the 3 personality traces in the keywords array for that zodiac.
            zodiac.forEach((element, i) => {
                Object.assign(option, { [zodiac[i]]: [data.western_zodiac[zodiac[i]].keywords[randomNum]] })
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

    console.log(person.personality)

    //Cleaning the fields
    document.getElementById('name').value = ''
    document.getElementById('age').value = ''
    document.getElementById('SIN').value = ''
    document.getElementById('zodiac').value = ''

}

const clearInfo = () => {
    //Cleaning the fields
    document.getElementById('name').value = ''
    document.getElementById('age').value = ''
    document.getElementById('SIN').value = ''
    document.getElementById('zodiac').value = ''
}

