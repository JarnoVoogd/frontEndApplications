<!-- BarChart.svelte -->

<script>
  // Importing necessary functions and components from Svelte and D3
  import { onMount, afterUpdate } from 'svelte';
  import * as d3 from 'd3';
  import { eyeColorScale } from './EyeColorScale.js';
  import Tooltip from './Tooltip.svelte';

  // Exporting data property to receive data from parent component
  export let data;

  // Declaring variables for D3 elements and Tooltip component
  let svg;
  let x, y, chart;
  let tooltip;

  // onMount lifecycle hook: runs after the component is first mounted to the DOM
  onMount(() => {
    // Selecting the SVG container and initializing scales and elements
    svg = d3.select('#bar-chart');
    x = d3.scaleLinear();
    y = d3.scaleBand().padding(0.1);
    chart = svg.append('g');

    // Instantiating the Tooltip component
    tooltip = new Tooltip({
      target: document.body,
      props: {
        content: '',
        left: 0,
        top: 0,
        opacity: 0
      }
    });

    // Creating the initial bar chart
    createBarChart();
  });

  // afterUpdate lifecycle hook: runs whenever the data property is updated
  afterUpdate(() => {
    // Updating the bar chart when data changes
    updateBarChart();
  });

  // Function to create the initial bar chart
  function createBarChart() {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Setting the range for x and y scales
    x.range([0, width]);
    y.range([0, height]);

    // Translating the chart to accommodate margins
    chart.attr('transform', `translate(${margin.left},${margin.top})`);

    // Appending y-axis to the chart
    chart
      .append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y));

    // Appending x-axis to the chart and positioning it at the bottom
    chart.append('g').attr('class', 'x-axis').attr('transform', `translate(0, ${height})`);
  }

  // Function to update the bar chart when data changes
  function updateBarChart() {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Setting the range for x and y scales
    x.range([0, width]);
    y.range([0, height]);

    // Translating the chart to accommodate margins
    chart.attr('transform', `translate(${margin.left},${margin.top})`);

    // Setting domains for x and y scales based on data
    x.domain([0, d3.max(data, (d) => d.value)]);
    y.domain(data.map((d) => d.key));

    // Removing existing bars
    chart.selectAll('.bar').remove();

    // Adding new bars based on updated data
    chart
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('y', (d) => y(d.key))
      .attr('width', (d) => x(d.value))
      .attr('height', y.bandwidth())
      .attr('fill', (d) => eyeColorScale[d.key])
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut);

    // Updating y-axis and x-axis
    chart.select('.y-axis').call(d3.axisLeft(y));
    chart.select('.x-axis').call(d3.axisBottom(x));
  }

  // Function to handle mouseover event on bars
  function handleMouseOver(event, d) {
    // Calculating percentage for tooltip
    const percentage = ((d.value / d3.sum(data, (d) => d.value)) * 100).toFixed(2);

    // Updating the Tooltip component's props using set()
    tooltip.$set({
      content: `<strong>Eye Color:</strong> ${d.key}<br/>` +
               `<strong>Amount:</strong> ${d.value}<br/>` +
               `<strong>Percentage:</strong> ${percentage}%`,
      left: event.pageX + 'px',
      top: event.pageY - 28 + 'px',
      opacity: 1
    });
  }

  // Function to handle mouseout event on bars
  function handleMouseOut() {
    // Updating the Tooltip component's opacity using set()
    tooltip.$set({ opacity: 0 });
  }
</script>

<!-- SVG container for the bar chart -->
<svg id="bar-chart" width="600" height="400"></svg>
