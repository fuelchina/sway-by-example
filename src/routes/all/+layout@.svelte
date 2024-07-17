<script lang="ts">
  import { mobile } from "$lib/mobile";
  import "../../app.css";
</script>

{#if !mobile()}
  <div class="allLinks" style="flex-wrap: wrap;">
    <slot />
  </div>
{:else}
  <div class="allLinks" style="display: flex; flex-direction:column; padding: 80px 20px;">
    <slot />
  </div>
{/if}

<div class="panelMarkdown allExamples">
  Sway-by-Example is open-sourced on <a href="https://github.com/fuelchina/sway-by-example">GitHub</a> and was created by
  <a href="https://github.com/fuelchina">@fuelchina</a>
</div>
