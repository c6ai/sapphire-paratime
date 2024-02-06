// SPDX-License-Identifier: Apache-2.0

import { expect } from 'chai';
import { ethers } from 'hardhat';
import { GasTests } from '../typechain-types/contracts/tests/Gas.sol/GasTests';

const GAS_MARGIN_OF_ERROR = 5;

describe('Gas Padding', function () {
  let contract: GasTests;

  before(async () => {
    const factory = await ethers.getContractFactory('GasTests');
    contract = (await factory.deploy()) as unknown as GasTests;
  });

  it('Gas Padding works as Expected', async () => {
    const expectedGas = 122746;

    let tx = await contract.testConstantTime(1, 100000);
    let receipt = await tx.wait();
    expect(receipt!.cumulativeGasUsed).within(
      expectedGas - GAS_MARGIN_OF_ERROR,
      expectedGas + GAS_MARGIN_OF_ERROR,
    );

    tx = await contract.testConstantTime(2, 100000);
    receipt = await tx.wait();
    expect(receipt!.cumulativeGasUsed).within(
      expectedGas - GAS_MARGIN_OF_ERROR,
      expectedGas + GAS_MARGIN_OF_ERROR,
    );

    tx = await contract.testConstantTime(1, 100000);
    receipt = await tx.wait();
    expect(receipt!.cumulativeGasUsed).within(
      expectedGas - GAS_MARGIN_OF_ERROR,
      expectedGas + GAS_MARGIN_OF_ERROR,
    );

    // Note: calldata isn't included in gas padding
    // Thus when the value is 0 it will use 4 gas instead of 16 gas
    // XXX: sometimes this is off by 1 gas!
    tx = await contract.testConstantTime(0, 100000);
    receipt = await tx.wait();
    expect(receipt?.cumulativeGasUsed).within(
      expectedGas - 10 - GAS_MARGIN_OF_ERROR,
      expectedGas - 10,
    );
  });
});
