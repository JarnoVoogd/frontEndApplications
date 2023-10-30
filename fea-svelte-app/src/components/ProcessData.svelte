<script>
  import FetchData from "./FetchData.svelte";
  let personenData = [];
  let somPerSoort = {};

  function handleDataLoaded(event) {
    personenData = event.detail;

    // Process the data and populate somPerSoort
    personenData.forEach(i => {
      somPerSoort[i["eye_color"]] = (somPerSoort[i["eye_color"]] || 0) + 1;
    })
  }
</script>

<h1>Personen</h1>
{#each personenData as persoon}
  <p>{persoon.name}</p>
{/each}
<h2>Overzicht per oogkleur</h2>
{#each Object.keys(somPerSoort) as oogkleur}
  <p>{oogkleur}: {somPerSoort[oogkleur]}</p>
{/each}

<FetchData on:dataLoaded={handleDataLoaded} />