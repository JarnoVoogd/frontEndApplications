<script>
    // Importing necessary functions and components from Svelte
    import { onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte';
  
    // Creating an event dispatcher to communicate with parent components
    const dispatch = createEventDispatcher();
  
    // Initializing the selectedRace variable with a default value
    let selectedRace = 'all';
  
    // Defining arrays to store eye colors, separated into human and extraterrestrial colors
    const human = ['blue', 'brown', 'blue-gray', 'hazel'];
    const ext = ['yellow', 'red', 'black', 'orange', 'pink', 'silver', 'red-blue', 'gold', 'green-yellow', 'white'];
  
    // Creating an object to store which colors belong to different categories
    const colorMap = {
      human: human,
      ext: ext,
      all: [...human, ...ext]
    };
  
    // Function to filter data based on the selected race
    function filterData() {
      // Retrieving valid colors based on the selected race
      const validColors = colorMap[selectedRace];
      // Dispatching a custom event to inform the parent component about the selected race
      dispatch('filterData', validColors);
    }
  
    // Lifecycle hook: runs after the component is first mounted to the DOM
    onMount(() => {
      // Triggering the initial filter with 'all' selected
      filterData();
    });
  </script>
  
  <!-- Radio buttons for filtering eye colors -->
  <div>
    <!-- Radio button for selecting all eye colors -->
    <label>
      <input type="radio" bind:group={selectedRace} value="all" on:change={filterData} />
      Everything
    </label>
  
    <!-- Radio button for selecting human eye colors -->
    <label>
      <input type="radio" bind:group={selectedRace} value="human" on:change={filterData} />
      Human
    </label>
  
    <!-- Radio button for selecting extraterrestrial eye colors -->
    <label>
      <input type="radio" bind:group={selectedRace} value="ext" on:change={filterData} />
      Extraterrestrial
    </label>
  </div>
  