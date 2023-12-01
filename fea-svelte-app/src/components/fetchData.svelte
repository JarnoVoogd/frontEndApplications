<!-- fetchdata.svelte -->

<script>
  // Importing necessary functions from the Svelte library
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  // Creating an event dispatcher to send events from this component
  const dispatch = createEventDispatcher();

  // Arrays to store fetch promises and count the completed fetches
  let allFetches = [];
  let endFetch = 0;

  // Function to fetch data for a given person ID from the Star Wars API
  function fetchPeople(id) {
    // Constructing the API URL for a specific person
    const url = `https://swapi.dev/api/people/${id}/`;

    // Fetching data from the API and returning a promise
    return fetch(url)
      .then(response => {
        // Checking if the response status is OK (200)
        if (response.status === 200) {
          // Parsing the JSON data and returning it
          return response.json();
        } else {
          // Returning null for error cases
          return null;
        }
      });
  }

  // Lifecycle hook: runs after the component is first mounted to the DOM
  onMount(() => {
    // Looping through person IDs for fetch calls, limit to 3 successful fetches
    for (let i = 1; endFetch < 3 && i < 20; i++) {
      // Adding each fetch promise to the array
      allFetches.push(fetchPeople(i).then(persoon => {
        if (persoon !== null) {
          return persoon; // Return the fetched data
        } else {
          endFetch++;
          return null; // Return null for error cases
        }
      }));
    }

    // Fetching data for all person IDs asynchronously
    // Once all fetches are complete, the event "dataLoaded" is emitted with the fetched data
    Promise.all(allFetches).then(allePersonen => {
      // Filtering out null values (failed fetches) from the fetched data
      allePersonen = allePersonen.filter(persoon => persoon !== null);

      // Emitting the "dataLoaded" event with the fetched data
      dispatch("dataLoaded", allePersonen);
    });
  });
</script>
