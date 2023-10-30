<script>
  import FetchData from "./FetchData.svelte";
  let personenData = [];
  let somPerSoort = {};

  function handleDataLoaded(event) {
    personenData = event.detail;

    // Process the data and populate somPerSoort
    personenData.forEach(i => {
      somPerSoort[i["eye_color"]] = (somPerSoort[i["eye_color"]] || 0) + 1;
    }
  }
</script>

<FetchData on:dataLoaded={handleDataLoaded} />