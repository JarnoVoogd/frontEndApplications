<!-- Tooltip.svelte -->

<script>
    export let content = '';
    export let left = 0;
    export let top = 0;
    export let opacity = 0;
  </script>
  
  <style>
    .tooltip {
        top: 0;
        right: 0;
        position: absolute;
        z-index: 9999;
        background: none;
        border: 1px solid #ccc;
        padding: 10px;
        font-size: 14px;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s;
    }
  </style>
  
  {#if content}
    <div class="tooltip" style="left: {left}px; top: {top}px; opacity: {opacity}">
      {@html content}
    </div>
  {/if}
  