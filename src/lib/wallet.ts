import { Fuel } from 'fuels';
import { FuelWalletConnector, FuelWalletDevelopmentConnector } from '@fuels/connectors';

let fuel: Fuel | undefined;

function getFuel() {
  if (!fuel) {
    fuel = new Fuel({
      connectors: [new FuelWalletConnector(), new FuelWalletDevelopmentConnector()],
    });
  }

  return fuel;
}

export { getFuel };
