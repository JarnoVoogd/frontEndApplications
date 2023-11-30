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
      // Replace 'blue-gray' with 'bluegray'
      i['eye_color'] = i['eye_color']
        .replace('blue-gray', 'bluegray')
        .replace('unknown', 'silver');

      somPerSoort[i['eye_color']] = (somPerSoort[i['eye_color']] || 0) + 1;
    })
  }

  // Watch for changes in filterValue and update dataD3 accordingly
  $: dataD3 = Object.keys(somPerSoort)
    .filter((key) => somPerSoort[key] >= filterValue)
    .map((key) => ({
      key,
      value: somPerSoort[key],
  }));

  $: maxEyeColorValue = Math.max(...dataD3.map(d => d.value));

</script>

<!-- Add the slider input and display the current value -->
<h2>Filter Eye Colors</h2>
<div class="slider-container">
  <input type="range" bind:value={filterValue} min="1" max={maxEyeColorValue} />
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

  input[type=range] {
  height: 12px;
  -webkit-appearance: none;
  margin: 10px 0;
  width: 100%;
  background: none;
}
input[type=range]:focus {
  outline: none;
}
input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 14px;
  cursor: pointer;
  animate: 0.2s;
  box-shadow: 0px 0px 10px #2E67F8;
  background: #2E67F8;
  border-radius: 50px;
  border: 0px solid #2E67F8;
}
input[type=range]::-webkit-slider-thumb {
  box-shadow: 0px 0px 0px #000000;
  border: 0px solid #000000;
  height: 17px;
  width: 40px;
  border-radius: 50px;
  background: #FFFFFF;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -1.5px;
}
input[type=range]:focus::-webkit-slider-runnable-track {
  background: #2E67F8;
}
input[type=range]::-moz-range-track {
  width: 100%;
  height: 14px;
  cursor: pointer;
  animate: 0.2s;
  box-shadow: 0px 0px 10px #2E67F8;
  background: #2E67F8;
  border-radius: 50px;
  border: 0px solid #2E67F8;
}
input[type=range]::-moz-range-thumb {
  box-shadow: 0px 0px 0px #000000;
  border: 0px solid #000000;
  height: 17px;
  width: 40px;
  border-radius: 50px;
  background: #FFFFFF;
  cursor: pointer;
}
input[type=range]::-ms-track {
  width: 100%;
  height: 14px;
  cursor: pointer;
  animate: 0.2s;
  background: transparent;
  border-color: transparent;
  color: transparent;
}
input[type=range]::-ms-fill-lower {
  background: #2E67F8;
  border: 0px solid #2E67F8;
  border-radius: 100px;
  box-shadow: 0px 0px 10px #2E67F8;
}
input[type=range]::-ms-fill-upper {
  background: #2E67F8;
  border: 0px solid #2E67F8;
  border-radius: 100px;
  box-shadow: 0px 0px 10px #2E67F8;
}
input[type=range]::-ms-thumb {
  margin-top: 1px;
  box-shadow: 0px 0px 0px #000000;
  border: 0px solid #000000;
  height: 17px;
  width: 40px;
  border-radius: 50px;
  background: #FFFFFF;
  cursor: pointer;
}
input[type=range]:focus::-ms-fill-lower {
  background: #2E67F8;
}
input[type=range]:focus::-ms-fill-upper {
  background: #2E67F8;
}

  p {
    margin-left: 10px;
  }
</style>
