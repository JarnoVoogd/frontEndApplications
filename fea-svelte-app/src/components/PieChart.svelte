<!-- PieChart.svelte -->

<script>
  // Importing necessary modules and components
  import { onMount, afterUpdate } from 'svelte';
  import * as d3 from 'd3';
  import { eyeColorScale } from './EyeColorScale.js';
  import Tooltip from './Tooltip.svelte';

  // Exporting the 'data' prop to receive data for the pie chart
  export let data;

  // Declaring variables for D3 elements and current data
  let svg;
  let radius;
  let pie;
  let tooltip;
  let currentData;

  // Lifecycle hook: runs after the component is first mounted to the DOM
  onMount(() => {
    // Selecting the SVG element by ID
    svg = d3.select('#pie-chart');

    // Calculating the radius for the pie chart
    radius = Math.min(300, 300) / 2;

    // Creating a D3 pie chart layout
    pie = d3.pie().value((d) => d.value);

    // Creating the initial pie chart
    createPieChart();
  });

  // Lifecycle hook: runs after each update
  afterUpdate(() => {
    // Checking if the data has changed before updating the pie chart
    if (JSON.stringify(currentData) !== JSON.stringify(data)) {
      updatePieChart();
    }
  });

  // Function to create the initial pie chart
  function createPieChart() {
    // Setting the width and height of the SVG element
    svg.attr('width', 300).attr('height', 300);

    // Instantiating the Tooltip component
    tooltip = new Tooltip({
      target: document.body,
      props: { content: '' },
    });

    // Creating arcs for each data entry and appending them to the SVG
    svg
      .append('g')
      .attr('transform', `translate(${radius},${radius})`)
      .selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('class', 'arc')
      .attr('fill', (d) => eyeColorScale[d.data.key])
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut);
  }

  // Function to update the pie chart with new data
  function updatePieChart() {
    // Removing existing arcs
    svg.selectAll('.arc').remove();

    // Creating new arcs based on updated data
    const arcs = svg
      .append('g')
      .attr('transform', `translate(${radius},${radius})`)
      .selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('class', 'arc')
      .attr('fill', (d) => eyeColorScale[d.data.key])
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut);

    // Transitioning between old and new arcs for a smooth update
    const arcTween = (d) => {
      const i = d3.interpolate(currentData, d);
      currentData = i(0);
      return (t) => d3.arc().innerRadius(0).outerRadius(radius)(i(t));
    };

    arcs.transition()
      .duration(500)
      .attrTween('d', arcTween);
  }

  // Function to handle mouseover event on a pie chart segment
  function handleMouseOver(event, d) {
    // Calculating the percentage for the tooltip
    const percentage = ((d.data.value / d3.sum(data, (d) => d.value)) * 100).toFixed(2);

    // Updating the Tooltip component's props using set()
    tooltip.$set({
      content: 
        `<strong>Eye Color:</strong> ${d.data.key}<br/>` +
        `<strong>Amount:</strong> ${d.data.value}<br/>` +
        `<strong>Percentage:</strong> ${percentage}%`,
      left: event.pageX + 'px',
      top: event.pageY - 28 + 'px',
      opacity: 1
    });
  }

  // Function to handle mouseout event on a pie chart segment
  function handleMouseOut() {
    // Updating the Tooltip component's opacity using set()
    tooltip.$set({ opacity: 0 });
  }
</script>

<svg id="pie-chart"></svg>
