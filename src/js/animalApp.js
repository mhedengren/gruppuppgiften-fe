// globals document
"use strict";

(function IIFE(){
  const remoteUrl = 'localhost:3000';
  let animalType = 'cat';
  const $animalSelect = document.getElementById('animal-select');
  const $animalDescription = document.getElementById('animal-description');
  const $animalToAdd = document.getElementById('animal-to-add');
  const $animalAdd = document.getElementById('animal-add');

  function populateSelect(type) {
    fetch(`http://${remoteUrl}/${type}s`)
      .then((response) => response.json())
      .then((data) => {
        const animals = data.data;
        while ($animalSelect.firstChild) {
          $animalSelect.removeChild($animalSelect.firstChild);
        }
        animals.forEach((animal) => {
          const $option = document.createElement('option');
          $option.setAttribute('value', animal.id);
          $option.setAttribute('data-name', animal.name);
          const $optionText = document.createTextNode(animal.name);
          $option.appendChild($optionText);
          $animalSelect.appendChild($option);
        });
      });
  }

  function getByTypeAndId(type, id) {
    fetch(`http://${remoteUrl}/${type}/${id}`)
      .then((response) => response.json())
      .then((data) => {
        while($animalDescription.firstChild) {
          $animalDescription.removeChild($animalDescription.firstChild);
        }
        const $pre = document.createElement('pre');
        const text = JSON.stringify(data.data, null, '\t');
        const $preText = document.createTextNode(text);
        $pre.appendChild($preText);
        $animalDescription.appendChild($pre);
        $animalDescription.setAttribute('data-loaded', 'true');
      });
  }

  function listenToSelect() {
    $animalSelect.addEventListener('change', (e) => {
      const id = e.target.selectedOptions[0].value;
      getByTypeAndId(animalType, id);
    });
  }

  function listenToAdd() {
    $animalAdd.addEventListener('click', () => {
      const dataText = $animalToAdd.value;
      const dataObject = JSON.parse(dataText);
      while($animalToAdd.firstChild) {
        $animalToAdd.removeChild($animalToAdd.firstChild);
      }
      fetch(`http://${remoteUrl}/${animalType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataObject),
      })
        .then(() => populateSelect(animalType));
    })
  }

  populateSelect(animalType);
  listenToSelect();
  listenToAdd();
})();