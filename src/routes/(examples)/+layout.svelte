<script lang="ts">
  import { Split, DefaultSplitter } from "@geoffcox/svelte-splitter";
  import { Button, Space } from "@svelteuidev/core";
  import { config as faConfig } from "@fortawesome/fontawesome-svg-core";
  import { Buffer } from "buffer";
  import { onMount } from "svelte";
  import { highlightSwayCode as highlightSwayCode } from "$lib/highlight";
  import { marked } from "marked";
  import { convertToText } from "$lib/helpers";
  import { mobile } from "$lib/mobile";
  import store from "$lib/store";
  import { page } from '$app/stores';
  import NavDropdown from "./NavDropdown.svelte";
  import WalletConnector from "./WalletConnector.svelte";
  import LangSelector from "./LangSelector.svelte";

  import "@fortawesome/fontawesome-svg-core/styles.css";
  import "../../loader.css";
  import "../../app.css";
  import "../../shiki.css";
  import { slide } from "svelte/transition";
  import type { Contract } from "fuels";

  faConfig.autoAddCss = false;

  BigInt.prototype.toJSON = function () {
    return this.toString();
  };

  let loaded = false;
  let terminalElement: HTMLPreElement;
  let markdownHtml = "";
  let swayHtml = "";
  let terminalContent = "";
  let contractInstances: any[];
  let next: { name: string; id: string } | undefined, prev: { name: string; id: string } | undefined;
  const url = new URL($page.url.href);
  const lang = url.searchParams.get('lang') ?? 'en';

  store.subscribe(async (s) => {
    if (!s.swayCode) return;
    markdownHtml = marked(s.markdown);
    swayHtml = `<pre>${s.swayCode}</pre>`;
    swayHtml = await highlightSwayCode(s.swayCode);
    next = s.next;
    prev = s.prev;
    terminalContent = "";
  });

  onMount(() => {
    loaded = true;
    globalThis.Buffer = Buffer;
  });

  function terminalLog(msg: string) {
    terminalContent += msg + "\n";
  }

  function terminalError(e: Error) {
    if (e.message.startsWith("Cannot read properties of undefined")) {
      terminalLog("Error: Contract is not deployed, please deploy by pressing the 'Deploy' button");
    } else {
      terminalLog(e.toString());
    }
  }

  function terminalScrollToBottom() {
    setTimeout(() => {
      terminalElement.scroll({ top: terminalElement.scrollHeight, behavior: "smooth" });
      terminalLog("");
    });
  }

  async function runDeploy(deploy: () => Promise<Contract[]>) {
    try {
      terminalLog(`> 📝 Deploying contract:`);
      const contracts = await deploy();
      contractInstances = contracts;
      terminalLog(`Contract was successfully deployed to ${contracts[0].provider.url}`)
      terminalLog(`Deployed ${contracts.length} contract(s)`);
      terminalLog(`Contract address(es): ${contracts.map((c) => c.id.toHexString()).join(", ")}`);
    } catch (e: any) {
      terminalError(e);
    }
    terminalScrollToBottom();
  }

  async function runGetter(name: string, getter: () => Promise<any>) {
    try {
      terminalLog(`> 🔍 Calling getter ${name}:`);
      const result = await getter();
      terminalLog(`Return value: ${convertToText(result)}`);
    } catch (e: any) {
      terminalError(e);
    }
    terminalScrollToBottom();
  }

  async function runMessage(name: string, message: () => Promise<any[]>) {
    try {
      terminalLog(`> 📤 Sending message ${name}:`);
      const results = await message();
      terminalLog(`result: ${results}`);
    } catch (e: any) {
      terminalError(e);
    }
    terminalScrollToBottom();
  }

  function changeLang(lang: string) {
    location.href = `?lang=${lang}`;
  }
</script>

{#if !loaded}
  <div class="pageLoader">
    <div class="sk-folding-cube">
      <div class="sk-cube1 sk-cube" />
      <div class="sk-cube2 sk-cube" />
      <div class="sk-cube4 sk-cube" />
      <div class="sk-cube3 sk-cube" />
    </div>
  </div>
{/if}

<nav class="NavLinks">
  <div class="NavLinks-brand">
    <NavDropdown current={$page.route.id?.split('/').pop()} {lang} />
    <Space w="xs" />
    <a class="NavLinks-home" href="/">Sway by Example</a>
  </div>
  <div class="NavLinks-actionBar">
    <WalletConnector />
    <Space w="xs" />
    <LangSelector {lang} on:change={event => changeLang(event.detail)} />
  </div>
</nav>

{#if !mobile()}
  <Split initialPrimarySize="47%">
    <div slot="primary" class="panelMarkdown" style="position: absolute; top: 0; bottom: 0; left: 0; right: 0; overflow: scroll;">
      {@html markdownHtml}<slot />
      <div class="navMarkdown">
        {#if prev}
          <a style="position: absolute; left: 50px;" href="/{prev.id}?lang={lang}">
            <svg
              style="transform: rotate(180deg);"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="nx-inline nx-h-5 nx-shrink-0 ltr:nx-rotate-180"
              ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg
            >
            {prev.name}
          </a>
        {/if}
        {#if next}
          <a style="position: absolute; right: 50px;" href="/{next.id}?lang={lang}">
            {next.name}
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="nx-inline nx-h-5 nx-shrink-0 rtl:nx-rotate-180"
              ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg
            >
          </a>
        {/if}
      </div>
      <a class="allExamples" href="/all">All Examples</a>
    </div>
    <svelte:fragment slot="splitter">
      <DefaultSplitter color="rgb(17, 17, 17)" hoverColor="#444" dragColor="#444" />
    </svelte:fragment>
    <svelte:fragment slot="secondary">
      <Split horizontal initialPrimarySize="80%">
        <div slot="primary" class="panelCode" style="position: absolute; top: 0; bottom: 0; left: 0; right: 0;">
          <div style="height: 100%; overflow: scroll;">
            <div contenteditable="false" bind:innerHTML={swayHtml} class="dark" />
          </div>
        </div>
        <svelte:fragment slot="splitter">
          <DefaultSplitter color="rgb(17, 17, 17)" hoverColor="#444" dragColor="#444" />
        </svelte:fragment>
        <div
          slot="secondary"
          class="panelBottom"
          style="position: absolute; top: 0; bottom: 0; left: 0; right: 0; display: flex; flex-direction: column;"
        >
          <div style="display: flex; gap: 10px; flex-wrap: wrap; overflow: hidden;">
            <Button class="buttonAction" size="xs" ripple on:click={() => runDeploy($store.deploy)}>Deploy</Button>

            {#each Object.keys($store.getters) as getter}
              <Button class="buttonAction" size="xs" ripple color="teal" on:click={() => runGetter(getter, $store.getters[getter])}
                >Get {getter}</Button
              >
            {/each}

            {#each Object.keys($store.messages) as message}
              <Button class="buttonAction" size="xs" ripple color="grape" on:click={() => runMessage(message, $store.messages[message])}
                >Send {message}</Button
              >
            {/each}
          </div>
          <pre bind:this={terminalElement} style="flex: 1; color: #666; overflow: scroll;">{terminalContent}</pre>
        </div>
      </Split>
    </svelte:fragment>
  </Split>
{:else}
  <div class="panelMarkdown" style="position: block;">
    {@html markdownHtml}<slot />
  </div>

  <div class="panelCode" style="margin: 20px;">
    <div style="height: 80%; overflow: scroll;">
      <div contenteditable="false" bind:innerHTML={swayHtml} class="dark" />
    </div>
  </div>

  <div class="panelBottom" style="display: flex; flex-direction: column; margin: 20px;">
    <div style="display: flex; gap: 10px; flex-wrap: wrap; overflow: hidden;">
      <Button class="buttonAction" size="xs" ripple on:click={() => runDeploy($store.deploy)}>Deploy</Button>

      {#each Object.keys($store.getters) as getter}
        <Button class="buttonAction" size="xs" ripple color="teal" on:click={() => runGetter(getter, $store.getters[getter])}
          >Get {getter}</Button
        >
      {/each}

      {#each Object.keys($store.messages) as message}
        <Button class="buttonAction" size="xs" ripple color="grape" on:click={() => runMessage(message, $store.messages[message])}
          >Send {message}</Button
        >
      {/each}
    </div>
    <pre bind:this={terminalElement} style="color: #666; overflow: scroll; height: 120px;">{terminalContent}</pre>
  </div>

  <div class="navMarkdown" style="padding: 40px;">
    {#if prev}
      <a style="float: left; margin-bottom: 15px;" href="/{prev.id}?lang={lang}">
        <svg
          style="transform: rotate(180deg);"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="nx-inline nx-h-5 nx-shrink-0 ltr:nx-rotate-180"
          ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg
        >
        {prev.name}
      </a>
    {/if}
    {#if next}
      <a style="float: right; margin-bottom: 15px;" href="/{next.id}?lang={lang}">
        {next.name}
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="nx-inline nx-h-5 nx-shrink-0 rtl:nx-rotate-180"
          ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg
        >
      </a>
    {/if}
  </div>
  <a class="allExamples" style="margin-bottom: 30px;" href="/all">All Examples</a>
{/if}
