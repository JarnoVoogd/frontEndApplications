<!-- piechart.svelte -->

<script>
  import { onMount, afterUpdate } from 'svelte';
  import * as d3 from 'd3';

  export let data;

  // Variables to store the SVG container, radius, pie function, and tooltip
  let svg;
  let radius;
  let pie;
  let tooltip;

  // Store the current data outside the component
  let currentData;

  // Lifecycle hook: runs after the component is first mounted to the DOM
  onMount(() => {
    // Select the SVG container by ID
    svg = d3.select('#pie-chart');
    // Calculate the radius based on the minimum of width and height divided by 2
    radius = Math.min(300, 300) / 2; // Adjust the radius as needed
    // Create a pie function that calculates angles based on the data values
    pie = d3.pie().value((d) => d.value);

    // Initialize the pie chart
    createPieChart();
  });

  // Lifecycle hook: runs after a component updates
  afterUpdate(() => {
    // Update the pie chart if the data changes
    updatePieChart();
  });

  // Function to create the initial pie chart
  function createPieChart() {
    // Set the width and height of the SVG container
    svg.attr('width', 300).attr('height', 300);

    // Create a tooltip and append it to the body
    tooltip = d3.select('body').append('div').attr('class', 'tooltip');

    // Create a group element within the SVG and position it at the center
    svg
      .append('g')
      .attr('transform', `translate(${radius},${radius})`)
      // Bind the data to path elements, creating one path per data point
      .selectAll('path')
      .data(pie(data))
      .enter()
      // For each data point, create a path using the arc function
      .append('path')
      .attr('class', 'arc') // Class name changed to 'arc'
      .attr('fill', (d, i) => d3.schemeCategory10[i]) // Use color scale as needed
      // Add mouseover and mouseout event handlers
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut);
  }

  // Function to update the pie chart when the data changes
  function updatePieChart() {
    // Select all path elements and bind the updated data
    const paths = svg.selectAll('.arc').data(pie(data));

    // Calculate start and end angles for each data point
    const arcTween = (d) => {
      const i = d3.interpolate(currentData, d);
      currentData = i(0);
      return (t) => d3.arc().innerRadius(0).outerRadius(radius)(i(t));
    };

    // Update existing paths with transition
    paths.transition()
      .duration(500)
      .attrTween('d', arcTween)
      .attr('fill', (d, i) => d3.schemeCategory10[i]);

    // Remove paths that are no longer needed
    paths.exit().remove();

    // Function to create a path for each new data point
    const enterPaths = (enter) => {
      enter
        .append('path')
        .attr('class', 'arc')
        .attr('fill', (d, i) => d3.schemeCategory10[i])
        .each(function (d) { currentData = d; }) // Store the current data for interpolation
        .transition()
        .duration(500)
        .attrTween('d', arcTween);
    };

    // Apply the enterPaths function to new data points
    paths.enter().call(enterPaths);
  }

  // Event handler for mouseover events
  function handleMouseOver(event, d) {
    // Calculate the percentage of the total value for the current data point
    const percentage = ((d.data.value / d3.sum(data, (d) => d.value)) * 100).toFixed(2);

    // Display information on screen using the tooltip
    tooltip
      .html(
        `<strong>Eye Color:</strong> ${d.data.key}<br/>` +
        `<strong>Amount:</strong> ${d.data.value}<br/>` +
        `<strong>Percentage:</strong> ${percentage}%`
      )
      // Position the tooltip next to the mouse cursor
      .style('left', event.pageX + 'px')
      .style('top', event.pageY - 28 + 'px')
      .style('opacity', 1);
  }

  // Event handler for mouseout events
  function handleMouseOut() {
    // Clear information and hide the tooltip on mouseout
    tooltip.style('opacity', 0);
  }
</script>

<style>
  /* Add your styling here if needed */
</style>

<svg id="pie-chart"></svg>
