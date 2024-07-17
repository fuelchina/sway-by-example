<script lang="ts">
  import { page } from '$app/stores';
  import { getExample } from "$lib/helpers";
  import store from "$lib/store";
  import { deploy } from "$lib/deploy";
  import type { Contract } from "fuels";

  import enMarkdown from "./content.en.md?raw";
  import zhMarkdown from "./content.zh.md?raw";

  import swayCode from "./src/main.sw?raw";
  import hexContent from './out/release/cheatsheet-solidity.hex?raw';
  import abiContent from './out/release/cheatsheet-solidity-abi.json?raw';
  import storageSlotsContent from './out/release/cheatsheet-solidity-storage_slots.json?raw';

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
    messages: {},
    getters: {
      get_blocknumber: async () => {
        const { value } =  await contract.functions.get_blocknumber().get()
        return value;
      },  
      get_blocktime: async () => {
        const { value } =  await contract.functions.get_blocktime().get()
        return value.toString();
      },
      get_msg_sender: async () => {
        const { value } =  await contract.functions.get_msg_sender().get()
        return value.Address.bits;
      },
      get_u128_number: async () => {
        const { value } =  await contract.functions.get_u128_number().get()
        return {upper: value.upper.toNumber(), lower: value.lower.toNumber()};
      },
    },
    prev: getExample($page.route.id).prev,
    next: getExample($page.route.id).next,
  };
</script>
