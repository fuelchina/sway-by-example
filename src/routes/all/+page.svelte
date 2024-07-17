<script lang="ts">
  import { SimpleGrid, type SimpleGridBreakpoint } from "@svelteuidev/core";
  import examples from "../(examples)/examples.json";

  const breakpoints: SimpleGridBreakpoint[] = [
    { minWidth: "sm", cols: 2 },
    { minWidth: "md", cols: 3 },
    { minWidth: "lg", cols: 4 },
  ];
</script>

<SimpleGrid {breakpoints}>
  {#each examples as example}
    <a class="GridCellLink" href="/{example.id}">{example.name}</a>
  {/each}
</SimpleGrid>

<style>
  .GridCellLink {
    border: 1px solid rgba(255, 255, 255, .3);
    border-radius: 6px;
  }

  .GridCellLink:hover {
    border-color: #fff;
  }
</style>
