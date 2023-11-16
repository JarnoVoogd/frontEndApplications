<script>
    import { onMount, afterUpdate } from 'svelte';
    import * as d3 from 'd3';
  
    export let data;
  
    let svg;
    let radius;
    let pie;
    let tooltip;
  
    onMount(() => {
      svg = d3.select('#pie-chart');
      radius = Math.min(300, 300) / 2; // Adjust the radius as needed
      pie = d3.pie().value((d) => d.value);
  
      createPieChart();
    });
  
    afterUpdate(() => {
      updatePieChart();
    });
  
    function createPieChart() {
      svg.attr('width', 300).attr('height', 300);
  
      tooltip = d3.select('body').append('div').attr('class', 'tooltip');
  
      svg
        .append('g')
        .attr('transform', `translate(${radius},${radius})`)
        .selectAll('path')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('d', d3.arc().innerRadius(0).outerRadius(radius))
        .attr('fill', (d, i) => d3.schemeCategory10[i]) // Use color scale as needed
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut);
    }
  
    function updatePieChart() {
      svg.selectAll('path').data(pie(data)).attr('d', d3.arc().innerRadius(0).outerRadius(radius));
    }
  
    function handleMouseOver(event, d) {
      const percentage = ((d.data.value / d3.sum(data, (d) => d.value)) * 100).toFixed(2);
  
      // Display information on screen
      tooltip
        .html(
          `<strong>Eye Color:</strong> ${d.data.key}<br/>` +
          `<strong>Amount:</strong> ${d.data.value}<br/>` +
          `<strong>Percentage:</strong> ${percentage}%`
        )
        .style('left', event.pageX + 'px')
        .style('top', event.pageY - 28 + 'px')
        .style('opacity', 1);
    }
  
    function handleMouseOut() {
      // Clear information on mouseout
      tooltip.style('opacity', 0);
    }
  </script>
  
  <style>
    /* Add your styling here if needed */
    .tooltip {
      position: absolute;
      text-align: left;
      padding: 6px;
      font: 12px sans-serif;
      background: #fff;
      border: 1px solid #ccc;
      border-radius: 3px;
      pointer-events: none;
    }
  </style>
  
  <svg id="pie-chart"></svg>
  