<script lang="ts">
  import { Menu, ActionIcon } from "@svelteuidev/core";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import { faBars } from "@fortawesome/free-solid-svg-icons";
  import { goto } from "$app/navigation";
  import examples from "./examples.json";

  export let lang: string;
  export let current: string | undefined;

  function handleMenuItemClick(id: string) {
    let url = `/${id}`;

    if (lang) {
      url += `?lang=${lang}`
    }

    goto(url);
  }
</script>

<Menu trigger="hover">
  <ActionIcon variant="default" slot="control">
    <FontAwesomeIcon icon={faBars} fixedWidth />
  </ActionIcon>
  {#each examples as example (example.id)}
    <Menu.Item disabled={example.id === current} on:click={handleMenuItemClick.bind(null, example.id)}>{example.name}</Menu.Item>
  {/each}
</Menu>
