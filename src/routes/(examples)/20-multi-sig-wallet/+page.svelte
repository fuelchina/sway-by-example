<script lang="ts">
  import { page } from '$app/stores';
  import { getExample } from "$lib/helpers";
  import store from "$lib/store";
  import { deploy } from "$lib/deploy";
  import type { Contract } from "fuels";

  import enMarkdown from "./content.en.md?raw";
  import zhMarkdown from "./content.zh.md?raw";

  import swayCode from "./src/main.sw?raw";
  import hexContent from './out/release/multi-sig-wallet.hex?raw';
  import abiContent from './out/release/multi-sig-wallet-abi.json?raw';

  const url = new URL($page.url.href);
  const lang = url.searchParams.get('lang');

  let contract: Contract;
  let bytecode = '0x' + hexContent;
  let abi = JSON.parse(abiContent);
  const markdown = lang === 'zh' ? zhMarkdown : enMarkdown;

  $store = {
    markdown,
    swayCode,
    deploy: async () => {
      contract = await deploy(bytecode, abi, undefined);
      return [contract];
    },
    messages: {},
    getters: {
      main: async () => {
        const { value } =  await contract.functions.main().get()
        return value;
      },
    },
    prev: getExample($page.route.id).prev,
    next: getExample($page.route.id).next,
  };
</script>
