<!-- processdata.svelte -->

<script>
  // Import necessary components and functions from other files
  import FetchData from './FetchData.svelte';
  import BarChart from './BarChart.svelte';
  import PieChart from './PieChart.svelte';
  import FilterRadio from './FilterRadio.svelte';

  // Initialize variables to store data and filtering information
  let personenData = [];
  let somPerSoort = {};
  let dataD3 = [];
  let filterValue = 1; // Default filter value

  // Function to handle filter data event from FilterRadio
  function handleFilterData(event) {
    const validColors = event.detail;
    // Update the data based on the selected race
    dataD3 = Object.keys(somPerSoort)
      .filter((key) => validColors.includes(key))
      .map((key) => ({
        key,
        value: somPerSoort[key],
      }));
  }

  // Function to handle data loaded event from FetchData
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

  // Calculate the maximum eye color value for the filter slider
  $: maxEyeColorValue = Math.max(...dataD3.map(d => d.value));

</script>

<!-- HTML structure for the component -->
<div class="container">
  <!-- Add the slider input and display the current value -->
  <h2>Filter Eye Colors</h2>
  <div class="slider-container">
    <div>
      <!-- Bind the slider input to filterValue and call filterData on change -->
      <input type="range" bind:value={filterValue} min="1" max={maxEyeColorValue} />
      <FilterRadio on:filterData={handleFilterData} />
    </div>
    
    <!-- Display the current value of the filter -->
    <p>Filter Value: {filterValue}</p>
  </div>

  <!-- Check if there is data to display -->
  {#if dataD3.length > 0}
    <div class="chart-container">
      <!-- Render BarChart and PieChart components with filtered data -->
      <BarChart data={dataD3} />
      <PieChart data={dataD3} />
    </div>
  {/if}

  <h2>Overzicht per oogkleur</h2>
  <!-- Display a summary of eye colors and their counts -->
  {#each Object.keys(somPerSoort) as oogkleur}
    <p>{oogkleur}: {somPerSoort[oogkleur]}</p>
  {/each}

  <!-- Fetch data from the API and trigger dataLoaded event -->
  <FetchData on:dataLoaded={handleDataLoaded} />
</div>


<style>
  .slider-container {
    width: 50%;
    display: flex;
    align-items: center;
  }

  .chart-container {
    display: flex;
    justify-content: space-between;
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
