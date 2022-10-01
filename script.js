let option = []
let peopleArray = []
let idIndex = 0
let currentIndex = 0

class Person {
    name = ''
    age = ''
    SIN = ''
    zodiac = ''
    personality = ''

    constructor(_name, _age, _SIN, _zodiac, _personality) {
        this.name = _name
        this.age = _age
        this.SIN = _SIN
        this.zodiac = _zodiac
        this.personality = _personality

    }

}

//=========
//FUNCTIONS
//========
window.addEventListener('load', event => {
    clearInfo()

    //Getting array from localStorage if it exists
    if(localStorage.getItem('peopleArray') !== null){
        peopleArray = JSON.parse(localStorage.getItem('peopleArray'))

        //Rendering the localStorage array to the UI if it exists
        if (peopleArray !== null) {     
            render(peopleArray)
        }
    } 
  
    //Fetching the zodiac information to build the select
    fetch('https://raw.githubusercontent.com/dariusk/corpora/master/data/divination/zodiac.json')
        .then((response) => response.json())
        .then((data) => {
  
            /*Getting the key values from the JSON file and also the first element from an array of personality traces*/
            let zodiac = Object.keys(data.western_zodiac)

            let select = document.getElementById("zodiac");
            //Building object with the zodiac name as key, and one of the 3 personality traces in the keywords array for that zodiac.
            zodiac.forEach(item => {
                let optionElement = document.createElement("option");
                optionElement.text = item
                const random = Math.floor(Math.random() * 3)
                optionElement.value = JSON.stringify({zodiac: item, personality: data.western_zodiac[item].keywords[random]})                
                select.add(optionElement)  

                //Creating the OPTION array with personalities and zodiac names
                option.push({
                    zodiac : JSON.parse(optionElement.value).zodiac,
                    personality: JSON.parse(optionElement.value).personality
                })                
            })

    });

})


const clearLocalStorage = () => {
    localStorage.clear()
}

const saveInfo = () => {
    const name = document.getElementById('name').value
    const age = document.getElementById('age').value
    const SIN = document.getElementById('SIN').value
    let zodiacObj = {}
    try {
        zodiacObj = JSON.parse(document.getElementById('zodiac').value)
    } catch (e) {
        console.log('No Zodiac value chosen.')
    }
   
    const person = new Person(name, age, SIN, zodiacObj.zodiac, zodiacObj.personality)
    //+++++++++++
    //  Checks
    //+++++++++++
    if (name.length === 0 || age.length === 0 ||
        SIN.length === 0 || zodiacObj.length === 0){
        alert('Please fill all fields')
        return
    }

    if(!+age || !+SIN){
        alert('Please type numbers only for AGE and SIN.')
        return
    }

    //Adding person to the literal object of people
    peopleArray.push({
        name: person.name,
        age: person.age,
        SIN: person.SIN,
        zodiac: person.zodiac,
        personality: person.personality
    })
    

    //Render list to the screen
    render(peopleArray)

    //Saving to local storage
    saveToLocalStorage("peopleArray", peopleArray)

    //Cleaning the fields
    clearInfo()
    
}

const saveToLocalStorage = (name ,array) => {
    localStorage.setItem(name, JSON.stringify(array));
}

const render = (array) => {
    let personList = document.getElementById('personList')

    //Resetting the whole innerHtml
    personList.innerHTML = ''

    let index = 0

    //Building span element
    array.forEach(element => {
        personList = document.getElementById('personList')
        personList.innerHTML += 
        `<span class="parentSpan" id="${index++}"><strong>Name:</strong> ${element.name}<br>
        <strong>Age:</strong> ${element.age}<br>
        <strong>SIN:</strong> ${element.SIN}<br>
        <strong>Zodiac:</strong> ${element.zodiac}<br>
        <strong>Personality:</strong> ${element.personality + " "}<br>
        <button id="btnPeopleDelete" onclick="deletePerson(this)">X</button><br>
        <button id="btnPeopleEdit" onclick="editPerson(this)">Edit</button></span><br>`
    });
    
}

const clearInfo = () => {
    //Cleaning the fields
    document.getElementById('name').value = ''
    document.getElementById('age').value = ''
    document.getElementById('SIN').value = ''
    document.getElementById('zodiac').value = 'Choose an option'
    document.getElementById('searchInput').value = '';
}

const deletePerson = (btn) => {

    const parent = btn.parentElement
    const index = JSON.parse(localStorage.getItem('peopleArray'))

    peopleArray.splice(parent.id, 1)
    saveToLocalStorage('peopleArray', peopleArray)

    //Delete animation
    parent.classList.add("animationDelete")
    parent.addEventListener('transitionend', () => {
        render(peopleArray)
    })

}

const editPerson = (btn) => {

    //Clearing elements to rebuild the list
    let options = document.querySelectorAll('#editOption');
    options.forEach(option => option.remove());

    //getting currentPerson to edit
    const parent = btn.parentElement
    currentIndex = parent.id

    document.getElementById("modal").style.display = 'block'
    document.getElementById('nameEdit').value = peopleArray[parent.id].name
    document.getElementById('ageEdit').value = peopleArray[parent.id].age
    document.getElementById('SINEdit').value = peopleArray[parent.id].SIN

    //Building the select dynamically
    let select = document.getElementById("zodiacEdit");

    option.forEach((element,index) => {
        let optionElement = document.createElement("option");
        optionElement.id = 'editOption'
        optionElement.text = element.zodiac
        select.add(optionElement)
    });

    //*******
    document.getElementById('zodiacEdit').value = peopleArray[parent.id].zodiac

}

const editConfirm = () => {

    
    //Updating object
    peopleArray[currentIndex].name = document.getElementById('nameEdit').value
    peopleArray[currentIndex].age = document.getElementById('ageEdit').value
    peopleArray[currentIndex].SIN = document.getElementById('SINEdit').value
    peopleArray[currentIndex].zodiac = document.getElementById('zodiacEdit').value

    option.forEach((element, index) => {
        if (peopleArray[currentIndex].zodiac === element.zodiac){
            peopleArray[currentIndex].personality = element.personality          
        }
    });

    //Updating HTML
    closeModal()

    render(peopleArray)
    saveToLocalStorage('peopleArray', peopleArray)
}

const closeModal = () => {
    document.getElementById("modal").style.display = 'none'
}

const search = () => {
    const input = document.getElementById('searchInput');

    if(input.value.length === 0){
        render(peopleArray)
    }
    else{
        let filteredArray = peopleArray.filter(value => (value.name.toUpperCase()).indexOf((input.value).toUpperCase()) !== -1)
        render(filteredArray)
    }
    
}




