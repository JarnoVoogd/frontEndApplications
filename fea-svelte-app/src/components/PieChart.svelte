<!-- PieChart.svelte -->

<script>
  import { onMount, afterUpdate } from 'svelte';
  import * as d3 from 'd3';
  import { eyeColorScale } from './EyeColorScale.js';
  import Tooltip from './Tooltip.svelte';

  export let data;

  let svg;
  let radius;
  let pie;
  let tooltip;

  let currentData;

  onMount(() => {
    svg = d3.select('#pie-chart');
    radius = Math.min(300, 300) / 2;
    pie = d3.pie().value((d) => d.value);

    createPieChart();
  });

  afterUpdate(() => {
    if (JSON.stringify(currentData) !== JSON.stringify(data)) {
      updatePieChart();
    }
  });

  function createPieChart() {
    svg.attr('width', 300).attr('height', 300);

    tooltip = new Tooltip({
      target: document.body,
      props: { content: '' },
    });

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

  function updatePieChart() {
    svg.selectAll('.arc').remove();

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

    const arcTween = (d) => {
      const i = d3.interpolate(currentData, d);
      currentData = i(0);
      return (t) => d3.arc().innerRadius(0).outerRadius(radius)(i(t));
    };

    arcs.transition()
      .duration(500)
      .attrTween('d', arcTween);
  }

  function handleMouseOver(event, d) {
    const percentage = ((d.data.value / d3.sum(data, (d) => d.value)) * 100).toFixed(2);

    tooltip.$set({ content: 
      `<strong>Eye Color:</strong> ${d.data.key}<br/>` +
      `<strong>Amount:</strong> ${d.data.value}<br/>` +
      `<strong>Percentage:</strong> ${percentage}%`,
      left: event.pageX + 'px',
      top: event.pageY - 28 + 'px',
      opacity: 1
    });
  }

  function handleMouseOut() {
    tooltip.$set({ opacity: 0 });
  }
</script>

<style>
  /* Add your styling here if needed */
</style>

<svg id="pie-chart"></svg>
