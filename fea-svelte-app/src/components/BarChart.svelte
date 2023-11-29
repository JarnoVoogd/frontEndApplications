<!-- BarChart.svelte -->

<script>
  import { onMount, afterUpdate } from 'svelte';
  import * as d3 from 'd3';
  import { eyeColorScale } from './EyeColorScale.js';
  import Tooltip from './Tooltip.svelte';

  export let data;

  let svg;
  let x, y, chart;
  let tooltip;

  onMount(() => {
    svg = d3.select('#bar-chart');
    x = d3.scaleLinear();
    y = d3.scaleBand().padding(0.1);
    chart = svg.append('g');

    // Instantiate the Tooltip component
    tooltip = new Tooltip({
      target: document.body,
      props: {
        content: '',
        left: 0,
        top: 0,
        opacity: 0
      }
    });

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
      .call(d3.axisLeft(y));

    chart.append('g').attr('class', 'x-axis').attr('transform', `translate(0, ${height})`);
  }

  function updateBarChart() {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    x.range([0, width]);
    y.range([0, height]);

    chart.attr('transform', `translate(${margin.left},${margin.top})`);

    x.domain([0, d3.max(data, (d) => d.value)]);
    y.domain(data.map((d) => d.key));

    chart.selectAll('.bar').remove();

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

    chart.select('.y-axis').call(d3.axisLeft(y));
    chart.select('.x-axis').call(d3.axisBottom(x));
  }

  function handleMouseOver(event, d) {
    const percentage = ((d.value / d3.sum(data, (d) => d.value)) * 100).toFixed(2);

    // Update the Tooltip component's props using set()
    tooltip.$set({
      content: `<strong>Eye Color:</strong> ${d.key}<br/>` +
               `<strong>Amount:</strong> ${d.value}<br/>` +
               `<strong>Percentage:</strong> ${percentage}%`,
      left: event.pageX + 'px',
      top: event.pageY - 28 + 'px',
      opacity: 1
    });
  }

  function handleMouseOut() {
    // Update the Tooltip component's opacity using set()
    tooltip.$set({ opacity: 0 });
  }
</script>

<style>
  /* Add your styling here if needed */
</style>

<svg id="bar-chart" width="600" height="400"></svg>
