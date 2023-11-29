<script>
  import { onMount, afterUpdate } from 'svelte';
  import * as d3 from 'd3';

  export let data;

  // Variables to store the SVG container, scales, and chart
  let svg;
  let x, y, chart;

  // Lifecycle hook: runs after the component is first mounted to the DOM
  onMount(() => {
    // Select the SVG container by ID
    svg = d3.select('#bar-chart');
    // Create linear and band scales for x and y axes
    x = d3.scaleLinear();
    y = d3.scaleBand().padding(0.1);
    // Create a group element within the SVG to hold the chart
    chart = svg.append('g');

    // Initialize the bar chart
    createBarChart();
  });

  // Lifecycle hook: runs after a component updates
  afterUpdate(() => {
    // Update the bar chart if the data changes
    updateBarChart();
  });

  // Function to create the initial bar chart
  function createBarChart() {
    // Define margins and dimensions for the chart
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Set the ranges for the x and y scales
    x.range([0, width]);
    y.range([0, height]);

    // Set the transform attribute for the chart group element
    chart.attr('transform', `translate(${margin.left},${margin.top})`);

    // Append y-axis group element to the chart
    chart
      .append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y)); // Use axisLeft for y-axis

    // Append x-axis group element to the chart and translate it to the bottom
    chart.append('g').attr('class', 'x-axis').attr('transform', `translate(0, ${height})`);
  }

  // Function to update the bar chart when the data changes
  function updateBarChart() {
    // Define margins and dimensions for the chart
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Set the ranges for the x and y scales
    x.range([0, width]);
    y.range([0, height]);

    // Set the transform attribute for the chart group element
    chart.attr('transform', `translate(${margin.left},${margin.top})`);

    // Adjust the domain of the x and y scales based on the data
    x.domain([0, d3.max(data, (d) => d.value)]);
    y.domain(data.map((d) => d.key));

    // Remove existing bars
    chart.selectAll('.bar').remove();

    // Add new bars
    chart
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('y', (d) => y(d.key))
      .attr('width', (d) => x(d.value))
      .attr('height', y.bandwidth());

    // Update the y-axis and x-axis based on the updated scales
    chart.select('.y-axis').call(d3.axisLeft(y));
    chart.select('.x-axis').call(d3.axisBottom(x)); // Use axisBottom for x-axis
  }
</script>

<style>
  /* Add your styling here if needed */
</style>

<svg id="bar-chart" width="600" height="400"></svg>

