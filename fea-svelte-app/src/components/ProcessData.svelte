<script>
  import FetchData from './FetchData.svelte';
  import BarChart from './BarChart.svelte';
  import PieChart from './PieChart.svelte';

  let personenData = [];
  let somPerSoort = {};
  let dataD3 = [];

  function handleDataLoaded(event) {
    personenData = event.detail;

    // Process the data and populate somPerSoort
    personenData.forEach((i) => {
      somPerSoort[i['eye_color']] = (somPerSoort[i['eye_color']] || 0) + 1;
    });

    // Prepare data for the bar and pie charts
    dataD3 = Object.keys(somPerSoort).map((key) => ({
      key,
      value: somPerSoort[key],
    }));
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

{#if dataD3.length > 0}
  <BarChart data={dataD3} />
  <PieChart data={dataD3} />
{/if}

<FetchData on:dataLoaded={handleDataLoaded} />
