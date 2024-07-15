<script lang="ts">
  import { page } from '$app/stores';
  import { getExample } from "$lib/helpers";
  import store from "$lib/store";
  import { deploy } from "$lib/deploy";
  import type { Contract } from "fuels";

  import enMarkdown from "./content.en.md?raw";
  import zhMarkdown from "./content.zh.md?raw";

  import swayCode from "./src/main.sw?raw";
  import hexContent from './out/release/base-asset.hex?raw';
  import abiContent from './out/release/base-asset-abi.json?raw';
  import storageSlotsContent from './out/release/base-asset-storage_slots.json?raw';

  const url = new URL($page.url.href);
  const lang = url.searchParams.get('lang');

  let contract: Contract;
  let bytecode = '0x' + hexContent;
  let abi = JSON.parse(abiContent);
  const storageSlots = JSON.parse(storageSlotsContent);
  const markdown = lang === 'zh' ? zhMarkdown : enMarkdown;

  $store = {
    markdown,
    swayCode,
    deploy: async () => {
      contract = await deploy(bytecode, abi, storageSlots);
      return [contract];
    },
    messages: {
      deposit: async () => {
        const { value } =  await contract.functions.deposit().call()
        return value;
      },
      "withdraw(10)": async () => {
        const { value } =  await contract.functions.withdraw(10).call()
        return value;
      },
    },
    getters: {
      get_balance: async () => {
        const { value } =  await contract.functions.get_balance().get()
        return value.toNumber();
      },
    },
    prev: getExample($page.route.id).prev,
    next: getExample($page.route.id).next,
  };
</script>
