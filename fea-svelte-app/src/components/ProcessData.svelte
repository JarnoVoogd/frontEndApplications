<script>
  import FetchData from './FetchData.svelte';
  import BarChart from './BarChart.svelte';
  import PieChart from './PieChart.svelte';

  let personenData = [];
  let somPerSoort = {};
  let dataD3 = [];
  let filterValue = 1; // Default filter value

  function handleDataLoaded(event) {
    personenData = event.detail;

    // Process the data and populate somPerSoort
    personenData.forEach((i) => {
      somPerSoort[i['eye_color']] = (somPerSoort[i['eye_color']] || 0) + 1;
    })
  }

  // Watch for changes in filterValue and update dataD3 accordingly
  $: dataD3 = Object.keys(somPerSoort)
    .filter((key) => somPerSoort[key] > filterValue)
    .map((key) => ({
      key,
      value: somPerSoort[key],
    }));
</script>

<!-- Add the slider input and display the current value -->
<h2>Filter Eye Colors</h2>
<div class="slider-container">
  <input type="range" bind:value={filterValue} min="1" max="10" />
  <p>Filter Value: {filterValue}</p>
</div>

<h2>Overzicht per oogkleur</h2>
{#each Object.keys(somPerSoort) as oogkleur}
  <p>{oogkleur}: {somPerSoort[oogkleur]}</p>
{/each}

{#if dataD3.length > 0}
  <BarChart data={dataD3} />
  <PieChart data={dataD3} />
{/if}

<FetchData on:dataLoaded={handleDataLoaded} />

<style>
  .slider-container {
    display: flex;
    align-items: center;
  }

  p {
    margin-left: 10px;
  }
</style>
