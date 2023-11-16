<script>
    import { onMount, afterUpdate } from 'svelte';
    import * as d3 from 'd3';
  
    export let data;
  
    let svg;
    let x, y, chart;
  
    onMount(() => {
      svg = d3.select('#bar-chart');
      x = d3.scaleLinear(); // Use linear scale for x-axis
      y = d3.scaleBand().padding(0.1); // Use band scale for y-axis
      chart = svg.append('g');
  
      createBarChart();
    });
  
    afterUpdate(() => {
      updateBarChart();
    });
  
    function createBarChart() {
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = 600 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;
  
      x.range([0, width]);
      y.range([0, height]);
  
      chart.attr('transform', `translate(${margin.left},${margin.top})`);
  
      chart
        .append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(y)); // Use axisLeft for y-axis
  
      chart.append('g').attr('class', 'x-axis').attr('transform', `translate(0, ${height})`);
    }
  
    function updateBarChart() {
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = 600 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;
  
      x.range([0, width]);
      y.range([0, height]);
  
      chart.attr('transform', `translate(${margin.left},${margin.top})`);
  
      x.domain([0, d3.max(data, (d) => d.value)]); // Adjust x domain
      y.domain(data.map((d) => d.key)); // Adjust y domain
  
      chart
        .selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', 0) // Set x position to 0
        .attr('y', (d) => y(d.key))
        .attr('width', (d) => x(d.value)) // Use x scale for width
        .attr('height', y.bandwidth()); // Use y scale for height
  
      chart.select('.y-axis').call(d3.axisLeft(y));
      chart.select('.x-axis').call(d3.axisBottom(x)); // Use axisBottom for x-axis
    }
  </script>
  
  <style>
    /* Add your styling here if needed */
  </style>
  
  <svg id="bar-chart" width="600" height="400"></svg>
  