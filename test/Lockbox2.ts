import { expect } from "chai";
import hre from "hardhat";

import { parseEther } from "ethers/lib/utils";
import { Lockbox2__factory, LockboxSetup__factory } from "../typechain-types";
import { Wallet } from "ethers";

describe("Lockbox", function () {
  it("works", async function () {
    const signer = (await hre.ethers.getSigners())[0];
    const wallet = new Wallet(
      "0x9b067b56552d3369e7762f0f92051db20a2db034e8e9fc803a71e64ae5b163b4",
      hre.ethers.provider
    );

    await signer.sendTransaction({
      to: wallet.address,
      value: parseEther("1000"),
    });

    const setupContract = await new LockboxSetup__factory(wallet).deploy();
    const contract = Lockbox2__factory.connect(
      await setupContract.lockbox2(),
      wallet
    );

    expect(await contract.locked()).to.be.true;

    await wallet.sendTransaction({
      to: contract.address,
      gasLimit: 560_000, // just works
      data:
        "0x890d6908" + // 4 byte selector for solve() method
        [
          "0000000000000000000000000000000000000000000000000000000000000061", // 0x60 to 0x61
          "0000000000000000000000000000000000000000000000000000000000000161", // 0x160 to 0x161
          "0000000000000000000000000000000000000000000000000000000000000001", // keeping this 1
          "000000000000000000000000000000000000000000000000000000000000000100", // one byte extra here
          "604080600b6000396000f300a86410b6215c11e36c6a60d02277415f69393b69",
          "2b6799805ee75969df78d25398733fc3e0438bbcbb9e37fa1ff5da79660324a6",
          "8452a4311cc7238d7431fa000000000000000000000000000000000000000000",
          "0000000000000000000000000000000000000000000000000000000000000000",
          "0000000000000000000000000000000000000000000000000000000000000000",
          "0000000000000000000000000000000000000000000000000000000000000000",
          "0000000000000000000000000000000000000000000000000000000000000000",
          "0000000000000000000000000000000000000000000000000000000000000000",
          "0000000000000000000000000000000000000000000000000000000000000000",
        ].join(""),
    });

    expect(await contract.locked()).to.be.false;
  });
});
