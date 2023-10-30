let allFetches = [];
let somPerSoort = [];
let personenData = [];

function fetchPeople(id) {
  const url = `https://swapi.dev/api/people/${id}/`;
  return fetch(url)
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        return null; // Return null for non-200 responses
      }
    });
}

let endFetch = 0;

for (let i = 0; endFetch < 3 && i < 20; i++) {
  allFetches.push(fetchPeople(i).then(persoon => {
    if (persoon !== null) {
      return persoon; // Return the fetched data
    } else {
      endFetch++;
      return null; // Return null for error cases
    }
  }));
}

Promise.all(allFetches).then(allePersonen => {
  allePersonen = allePersonen.filter(persoon => persoon !== null); // Remove null values

  for (let i = 0; i < allePersonen.length; i++) {
    personenData.push(allePersonen[i]["eye_color"]);
  }
  console.log(personenData);

  personenData.forEach((i) => {
    somPerSoort[i] = (somPerSoort[i] || 0) + 1;
  });

  console.log(somPerSoort);
});