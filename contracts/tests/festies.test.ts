import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;

/*
  The test below is an example. To learn more, read the testing documentation here:
  https://docs.hiro.so/stacks/clarinet-js-sdk
*/

describe("example tests", () => {
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
        recipient.address,
        name,
        message,
        festival,
        imageUri,
        metadataUri
      ],
      address1
    );
    expect(mintResult.isOk).toBe(true);
    const tokenId = mintResult.value;

    // Check get-token-uri returns the correct metadata-uri
    const { result: uriResult } = simnet.callReadOnlyFn(
      "festies",
      "get-token-uri",
      [tokenId],
      address1
    );
    expect(uriResult.isOk).toBe(true);
    expect(uriResult.value).toBeSome();
    expect(uriResult.value.value).toBe(metadataUri);

    // Check ownership
    const { result: ownerResult } = simnet.callReadOnlyFn(
      "festies",
      "get-owner",
      [tokenId],
      address1
    );
    expect(ownerResult.isOk).toBe(true);
    expect(ownerResult.value).toBeSome();
    expect(ownerResult.value.value).toBe(recipient.address);
  });
});
