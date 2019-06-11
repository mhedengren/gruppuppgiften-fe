// globals document
"use strict";

(function IIFE(){
  const remoteUrl = 'localhost:3000';
  let animalType = 'cat';
  const $animalTypeSelect = document.querySelectorAll('input[type=radio]');
  const $animalSelect = document.getElementById('animal-select');
  const $animalDescription = document.getElementById('animal-description');
  const $animalToAdd = document.getElementById('animal-to-add');
  const $animalAdd = document.getElementById('animal-add');

  //User input
  const $userNameInput = document.getElementById('name');
  const $userEmailInput = document.getElementById('email');
  var checkOne = /^[\w ]+$/;
  var checkTwo = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  function listenToUserInput() {

    document.querySelector('form#user-input').addEventListener('submit', function (e) {

        //prevent the normal submission of the form
        e.preventDefault();

        if ($userNameInput.value == "" || $userEmailInput.value == "") {
          document.getElementById("error1").innerHTML= "*All fields are required!";
          console.log("All fields are required!");
          $userNameInput.focus();
          return false;
        }

        if (!checkOne.test($userNameInput.value)) {
          document.getElementById("error2").innerHTML= "*Input contains invalid characters!";
          console.log("Error: Input contains invalid characters!");
          $userNameInput.focus();
          return false;
        }

        if (!checkTwo.test($userEmailInput.value)) {
          document.getElementById("error3").innerHTML= "*Input contains invalid e-mail format!";
          console.log("Error: Input contains invalid e-mail format!");
          $userEmailInput.focus();
          return false;
        }

        else {
          document.getElementById("success").innerHTML= "Thank you!";
          console.log('Your name: ' + $userNameInput.value); 
          console.log('Your e-mail: ' + $userEmailInput.value);
          return true;
        }

    }); 

  } 

  //User input end

  function clearElement(element) {
    while(element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function createOption(value, text) {
    const $option = document.createElement('option');
    $option.setAttribute('value', value);
    const $optionText = document.createTextNode(text);
    $option.appendChild($optionText);
    return $option;
  }

  function populateSelect(type) {
    clearElement($animalSelect);
    $animalSelect.setAttribute('data-loaded', 'false');
    fetch(`http://${remoteUrl}/${type}s`)
      .then((response) => response.json())
      .then((data) => {
        const animals = data.data;
        const $defaultOption = createOption(null, `Select ${animalType}`);
        $animalSelect.appendChild($defaultOption);
        animals.forEach((animal) => {
          const $option = createOption(animal.id, animal.name);
          $animalSelect.appendChild($option);
        });
        $animalSelect.setAttribute('data-loaded', 'true');
      });
  }

  function getByTypeAndId(type, id) {
    $animalDescription.setAttribute('data-loaded', 'false');
    clearElement($animalDescription);

    fetch(`http://${remoteUrl}/${type}/${id}`)
      .then((response) => response.json())
      .then((data) => {
        //const $pre = document.createElement('pre');
        const text = JSON.stringify(data.data, null, '\t');
        const $text = document.createTextNode(text);
        //$pre.appendChild($preText);
        $animalDescription.appendChild($text);
        $animalDescription.setAttribute('data-loaded', 'true');
      });
  }

  function listenToSelect() {
    $animalSelect.addEventListener('change', (e) => {
      const id = e.target.selectedOptions[0].value;
      getByTypeAndId(animalType, id);
    });
  }

  function listenToRadio() {
    for (let i = 0; i < $animalTypeSelect.length; i++) {
      const element = $animalTypeSelect[i];
      element.addEventListener('click', (e) => {
        //alert(e.target.value);   
        animalType = e.target.value;
        populateSelect(e.target.value); 
      });
    }
  }

  function listenToAdd() {
    $animalAdd.addEventListener('click', () => {
      $animalAdd.setAttribute('data-loaded', 'false');
      const dataText = $animalToAdd.value;
      const dataObject = JSON.parse(dataText);
      clearElement($animalToAdd);
      fetch(`http://${remoteUrl}/${animalType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataObject),
      })
        .then(() => {
          $animalAdd.setAttribute('data-loaded', 'true');
          populateSelect(animalType);
        });
    })
  }

  function pageLoaded() {
    populateSelect(animalType);
    listenToSelect();
    listenToRadio();
    listenToAdd();
    listenToUserInput();
  }

  window.pageLoaded = pageLoaded;

  module.exports = {
    clearElement,
    listenToRadio,
    listenToUserInput
  };


})();