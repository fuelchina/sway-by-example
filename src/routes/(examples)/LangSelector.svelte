<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Menu, ActionIcon } from "@svelteuidev/core";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import { faGlobe } from "@fortawesome/free-solid-svg-icons";

  const dispatch = createEventDispatcher();

  const langs = [
    { code: "en", text: "English" },
    { code: "zh", text: "简体中文" }
  ];

  export let lang: string;
</script>

<Menu trigger="hover">
  <ActionIcon variant="default" slot="control">
    <FontAwesomeIcon icon={faGlobe} fixedWidth />
  </ActionIcon>
  {#each langs as item (item.code)}
    <Menu.Item disabled={item.code === lang} on:click={() => dispatch("change", item.code)}>{item.text}</Menu.Item>
  {/each}
</Menu>
