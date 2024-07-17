<script lang="ts">
  import { onMount } from "svelte";
  import { Button, Modal, SimpleGrid, Badge, Space } from "@svelteuidev/core";
  import type { Fuel, FuelConnector } from "fuels";
  import { getFuel } from "$lib/wallet";

  const defaultButtonText = "Connect wallet";

  let connectTriggerDisabled = true;
  let buttonText = "Checking";
  let opened = false;

  let connectors: FuelConnector[] = [];
  let account: string = "";

  let guideShown = false;
  let chosenConnector: FuelConnector | null = null;

  async function resolveAddress(fuel: Fuel) {
    const currentAccount = await fuel.currentAccount();

    if (currentAccount) {
      const address = (await fuel.getWallet(currentAccount)).address.toB256();
      const splitted = address.split("");

      return ([] as string[]).concat(splitted.slice(0, 6), "...", splitted.slice(-4)).join("");
    }

    return "";
  }

  async function initWallet() {
    const fuel = getFuel();
    const connectExists = await fuel.hasConnector();

    let connected = false;

    if (connectExists) {
      connected = await fuel.isConnected();
    }

    connectors = await fuel.connectors();

    if (!connectExists || !connected) {
      buttonText = defaultButtonText;
    } else if (connected) {
      account = await resolveAddress(fuel);
      buttonText = account;
    }

    connectTriggerDisabled = false;
  }

  function handleTriggerClick() {
    if (account) {
      if (confirm("Are you sure to disconnect?")) {
        const fuel = getFuel();

        connectTriggerDisabled = true;

        fuel.disconnect()
          .then(() => {
            buttonText = defaultButtonText;
            account = "";
          })
          .catch(e => console.error('Error occurred when disconnect', e))
          .finally(() => (connectTriggerDisabled = false));
      }
    } else {
      opened = true;
    }
  }

  async function handleConnectorClick(connector: FuelConnector) {
    if (connector.installed) {
      const fuel = getFuel();

      connectTriggerDisabled = true;
      buttonText = "Connecting...";

      await fuel.selectConnector(connector.name);

      fuel.connect()
        .then(async connected => {
          if (connected) {
            account = await resolveAddress(fuel);
            opened = false;
            buttonText = account;
          } else {
            buttonText = defaultButtonText;
          }
        })
        .catch(e => {
          buttonText = defaultButtonText;
          console.error("Error occurred when connect", e);
        })
        .finally(() => (connectTriggerDisabled = false));
    } else {
      chosenConnector = connector;
      guideShown = true;
    }
  }

  function handleBackToList() {
    chosenConnector = null;
    guideShown = false;
  }

  function handleModalClose() {
    handleBackToList();

    opened = false;
  }

  onMount(initWallet);
</script>

<Button variant="default" size="xs" disabled={connectTriggerDisabled} on:click={handleTriggerClick}>{buttonText}</Button>
<Modal title="Choose wallet" target="body" centered {opened} on:close={handleModalClose}>
  {#if guideShown}
    <div class="WalletInstaller">
      <!-- <div class="WalletInstaller-icon"></div>
      <Space h="sm" /> -->
      <div class="WalletInstaller-name">{chosenConnector.name}</div>
      <div class="WalletInstaller-description">{chosenConnector.metadata.install.description}</div>
      <div class="WalletInstaller-actionBar">
        <Button variant="light" on:click={handleBackToList} fullSize>Back</Button>
        <Space w="xs" />
        <Button href={chosenConnector.metadata.install.link} external fullSize>{chosenConnector.metadata.install.action}</Button>
      </div>
    </div>
  {:else}
    <SimpleGrid>
      {#each connectors as connector}
        <Button variant="outline" color="gray" style="height: auto;" on:click={handleConnectorClick.bind(null, connector)}>
          <div class="Connector">
            <div class="Connector-main">
              <!-- <span class="Connector-icon"></span>
              <Space w="xs" /> -->
              <span class="Connector-name">{connector.name}</span>
            </div>
            {#if connector.installed}
              <Badge radius="sm">installed</Badge>
            {/if}
          </div>
        </Button>
      {/each}
    </SimpleGrid>
  {/if}
</Modal>

<style lang="scss">
  .Connector {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;

    &-main {
      display: inline-flex;
      align-items: center;
    }

    &-icon {
      width: 36px;
      height: 36px;
      background-color: aquamarine;
    }

    &-name {
      font-size: 16px;
    }
  }

  .WalletInstaller {
    text-align: center;

    &-icon {
      width: 100px;
      height: 100px;
      margin: 0 auto;
      background-color: aquamarine;
      border-radius: 10px;
    }

    &-name {
      margin-bottom: 12px;
      font-size: 18px;
      font-weight: bold;
    }

    &-description {
      font-size: 14px;
    }

    &-actionBar {
      display: flex;
      margin-top: 20px;
    }
  }
</style>
