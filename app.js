/**
 * Stores the list of kittens
 * @type {Kitten[]}
 */
let kittens = [];
/**
 * Called when submitting the new Kitten Form
 * This method will pull data from the form
 * use the provided function to give the data an id
 * you can use robohash for images
 * https://robohash.org/<INSERTCATNAMEHERE>?set=set4
 * then add that data to the kittens list.
 * Then reset the form
 */

function addKitten(event) {
  event.preventDefault();

  let existingKitten = false;

  let form = event.target;
  if(!form.name.value) {
   return alert('Please enter a valid kitten name.');
  }

  kittens.forEach(kitten => {
    if(kitten.name === form.name.value) {
      existingKitten = true;
      return alert('That kitten already exists. Please select another name.');
    } 
  })

  //conditional allowing addKitten function to stop executing if kitten.name already exist in kittens array.
  if(existingKitten === true) {
    form.reset();
    return;
  }

  let kitten = {
    id: generateId(),
    name: form.name.value,
    img: `https://robohash.org/${form.name.value}?set=set4`,
    mood: 'Tolerant',
    affection: 5
  }

  kittens.push(kitten);
  saveKittens();
  form.reset();
  drawKittens();
  getStarted();
}

/**
 * Converts the kittens array to a JSON string then
 * Saves the string to localstorage at the key kittens
 */
function saveKittens() {
  window.localStorage.setItem('kittens', JSON.stringify(kittens));
}

/**
 * Attempts to retrieve the kittens string from localstorage
 * then parses the JSON string into an array. Finally sets
 * the kittens array to the retrieved array
 */
function loadKittens() {
  let savedKittens = JSON.parse(window.localStorage.getItem('kittens'));

  if(savedKittens) {
    kittens = savedKittens;
  }
}

/**
 * Draw all of the kittens to the kittens element
 */
function drawKittens() {
  let kittenList = document.getElementById('kittens');
  let template = ''
  kittens.forEach(kitten => {
    template += `
    <div id="${
      kitten.id
    }" class="kitten p-1 m-1 bg-dark text-light text-align ${kitten.mood}">
          <button id="delete-kitten" onclick="removeKitten('${
            kitten.id
          }')"><i class="fas fa-trash-alt"></i></button>
          <img src="${kitten.img}" alt="Mood Kitten">
          <p class="mb-0">Name: ${kitten.name}<p>
          <p class="mb-0" id="kitten-mood${kitten.id}">Mood: ${kitten.mood}<p>
          <p class="mb-0" id="kitten-affection${kitten.id}">Affection: ${
      kitten.affection
    }<p>
          <div id="${kitten.id}-buttons" class="buttons d-flex justify-content-center">
            <button class="m-2 p-2" onclick="pet('${kitten.id}')">PET</button>
            <button class="m-2 p-2" onclick="catnip('${
              kitten.id
            }')">CATNIP</button>
          </div>
        </div>
    `;
  })
  kittenList.innerHTML = template;
  kittens.forEach(kitten => setKittenMood(kitten));
}

/**
 * Find the kitten in the array by its id
 * @param {string} id
 * @return {Kitten}
 */
function findKittenById(id) {
  return kittens.find(k => k.id == id);
}

/**
 * Find the kitten in the array of kittens
 * Generate a random Number
 * if the number is greater than .7
 * increase the kittens affection
 * otherwise decrease the affection
 * save the kittens
 * @param {string} id
 */
function pet(id) {
let currentKitten = findKittenById(id);
let randomNumber = randomNum();
if(randomNumber > 7) {
  currentKitten.affection++;
} else {
  currentKitten.affection--;
}

setKittenMood(currentKitten);
saveKittens();
}

/**
 * Find the kitten in the array of kittens
 * Set the kitten's mood to tolerant
 * Set the kitten's affection to 5
 * save the kittens
 * @param {string} id
 */
function catnip(id) {
  let currentKitten = findKittenById(id);
  currentKitten.mood = 'Tolerant';
  currentKitten.affection = 5;
  
  setKittenMood(currentKitten);
  saveKittens();
}

/**
 * Sets the kittens mood based on its affection
 * Happy > 6, Tolerant <= 5, Angry <= 3, Gone <= 0
 * @param {Kitten} kitten
 */
function setKittenMood(currentKitten) {
  
  let kitten = document.getElementById(currentKitten.id);
  let kittenMood = document.getElementById('kitten-mood'+currentKitten.id);
  let kittenAffection = document.getElementById('kitten-affection'+currentKitten.id);
  
  if(currentKitten.affection > 6) {
    // currentKitten.mood = 'Happy';  
    kitten.mood = "Happy";
    currentKitten.mood = 'Happy';
    kittenMood.innerHTML = `Mood: ${kitten.mood}`;
    kittenAffection.innerHTML = `Affection: ${currentKitten.affection}`;
    kitten.classList.remove('tolerant');
    kitten.classList.add('happy')
  } else if(currentKitten.affection >=4) {
    kitten.mood = 'Tolerant';
    currentKitten.mood = 'Tolerant';
    kittenMood.innerHTML = `Mood: ${kitten.mood}`;
    kittenAffection.innerHTML = `Affection: ${currentKitten.affection}`;
    kitten.classList.remove('happy');
    kitten.classList.remove('angry');
    kitten.classList.remove('gone');
    kitten.classList.add('tolerant');
  } else if(currentKitten.affection >=1) {
    kitten.mood = "Angry";
    currentKitten.mood = 'Angry';
    kittenMood.innerHTML = `Mood: ${kitten.mood}`;
    kittenAffection.innerHTML = `Affection: ${currentKitten.affection}`;
    kitten.classList.remove("tolerant");
    kitten.classList.remove("gone");
    kitten.classList.add('angry');
  } else if(currentKitten.affection <= 0){
    kitten.mood = "Gone";
    currentKitten.mood = 'Gone';
    kittenMood.innerHTML = `Mood: ${kitten.mood}`;
    kittenAffection.innerHTML = `Affection: ${currentKitten.affection}`;
    kitten.classList.remove('angry');
    kitten.classList.add('gone');
  }
  saveKittens();
}

function removeKitten(kittenId) {
  let index = kittens.findIndex(kitten => kitten.id == kittenId);
  if(index == -1) {
    throw new Error('Invalid Contact ID');
  }
  kittens.splice(index, 1);
  saveKittens();
  drawKittens();
}

function getStarted() {
  if(document.getElementById('welcome')) {
    document.getElementById("welcome").remove();
    drawKittens();
  }
}

function resetKittens() {
  kittens = [];
  saveKittens();
  loadKittens();
  getStarted();
}
/**
 * Defines the Properties of a Kitten
 * @typedef {{id: string, name: string, mood: string, affection: number}} Kitten
 */

/**
 * Used to generate a random string id for mocked
 * database generated Id
 * @returns {string}
 */
function generateId() {
  return (
    Math.floor(Math.random() * 10000000) +
    "-" +
    Math.floor(Math.random() * 10000000)
  );
}

// Generate random Number
function randomNum() {
  return Math.floor(Math.random() * 10) + 1
}

function reloadPage() {
  location.reload();
  return false;
}
loadKittens();