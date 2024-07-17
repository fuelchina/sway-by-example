import { Contract, ContractFactory } from 'fuels';

import { getFuel } from './wallet';

export function binToHex(str: string): string {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);
    let hex = '0x';
    for (const byte of bytes) {
        hex += byte.toString(16).padStart(2, '0');
    }
    return hex;
}

export async function deploy(bytecode: any, abi: any, storageSlots: any | undefined): Promise<Contract> {
    const wallet = await connectWallet();
    const factory = new ContractFactory(bytecode, abi, wallet);

    if (storageSlots) {
        return await factory.deployContract({ storageSlots });
    }
    return await factory.deployContract();
}

export async function loadContract(contractId: string, abi: any): Promise<Contract> {
    const wallet = await connectWallet();
    return new Contract(contractId, abi, wallet);
}

export async function connectWallet() {
    const fuel = getFuel();

    if (!await fuel.hasConnector()) {
        throw new Error("Please connect wallet first.");
    }

    console.log('current Network:', (await fuel.currentNetwork()).url);

    const account = await fuel.currentAccount();
    if (!account) {
        throw new Error("Current account not authorized for this connection!");
    }
    return await fuel.getWallet(account);
}
