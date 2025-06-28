/// <reference path="./clarinet-env.d.ts" />
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;

/*
  The test below is an example. To learn more, read the testing documentation here:
  https://docs.hiro.so/clarinet-js-sdk
*/

describe("Init connection", () => {
  it("ensures simnet is well initalised", () => {
    expect(simnet.blockHeight).toBeDefined();
  });

  // it("shows an example", () => {
  //   const { result } = simnet.callReadOnlyFn("counter", "get-counter", [], address1);
  //   expect(result).toBeUint(0);
  // });
});

describe("festies contract", () => {
  it("mints a greeting card NFT and returns the correct metadata-uri", () => {
    const recipient = accounts.get("wallet_2")!;
    const name = "Birthday Card";
    const message = "Happy Birthday!";
    const festival = "Birthday";
    const imageUri = "https://example.com/image.png";
    const metadataUri = "https://example.com/metadata.json";

    // Mint the NFT
    const { result: mintResult, events } = simnet.callPublicFn(
      "festies",
      "mint-greeting-card",
      [
        Cl.principal(recipient),
        Cl.stringAscii(name),
        Cl.stringAscii(message),
        Cl.stringAscii(festival),
        Cl.stringAscii(imageUri),
        Cl.stringAscii(metadataUri)
      ],
      address1
    );
    expect(mintResult).toBeOk(Cl.uint(1));
    
    // Extract token ID from the result
    const tokenId = Cl.uint(1);

    // Check get-token-uri returns the correct metadata-uri
    const { result: uriResult } = simnet.callReadOnlyFn(
      "festies",
      "get-token-uri",
      [tokenId],
      address1
    );
    expect(uriResult).toBeOk(Cl.some(Cl.stringAscii(metadataUri)));

    // Check ownership
    const { result: ownerResult } = simnet.callReadOnlyFn(
      "festies",
      "get-owner",
      [tokenId],
      address1
    );
    expect(ownerResult).toBeOk(Cl.some(Cl.principal(recipient)));
  });
});
