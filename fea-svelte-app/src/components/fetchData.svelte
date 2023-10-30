<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let allFetches = [];
  let endFetch = 0;

  function fetchPeople(id) {
  const url = `https://swapi.dev/api/people/${id}/`;
  return fetch(url)
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        return null;
      }
    });
}

  onMount(() => {
    for (let i = 1; endFetch < 3 && i < 20; i++) {
      allFetches.push(fetchPeople(i).then(persoon => {
        if (persoon !== null) {
          return persoon; // Return the fetched data
        } else {
          endFetch++;
          return null; // Return null for error cases
        }
      }));
    }

    // Fetch data and emit an event when done
    Promise.all(allFetches).then(allePersonen => {
      allePersonen = allePersonen.filter(persoon => persoon !== null);
      dispatch("dataLoaded", allePersonen);
    });
  });
</script>