/// <reference path="./clarinet-env.d.ts" />
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

describe("Init connection", () => {
  it("ensures simnet is well initalised", () => {
    expect(simnet.blockHeight).toBeDefined();
  });
});

describe("festies contract - Basic Functionality", () => {
  it("mints a greeting card NFT and returns the correct metadata-uri", () => {
    const recipient = wallet2;
    const name = "Birthday Card";
    const message = "Happy Birthday!";
    const festival = "Birthday";
    const imageUri = "https://example.com/image.png";
    const metadataUri = "https://example.com/metadata.json";

    // Mint the NFT
    const { result: mintResult } = simnet.callPublicFn(
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
      wallet1
    );
    expect(mintResult).toBeOk(Cl.uint(1));
    
    // Extract token ID from the result
    const tokenId = Cl.uint(1);

    // Check get-token-uri returns the correct metadata-uri
    const { result: uriResult } = simnet.callReadOnlyFn(
      "festies",
      "get-token-uri",
      [tokenId],
      wallet1
    );
    expect(uriResult).toBeOk(Cl.some(Cl.stringAscii(metadataUri)));

    // Check ownership
    const { result: ownerResult } = simnet.callReadOnlyFn(
      "festies",
      "get-owner",
      [tokenId],
      wallet1
    );
    expect(ownerResult).toBeOk(Cl.some(Cl.principal(recipient)));

    // Check greeting card data
    const { result: greetingResult } = simnet.callReadOnlyFn(
      "festies",
      "get-greeting-card",
      [tokenId],
      wallet1
    );
    expect(greetingResult).toBeOk(Cl.some(Cl.tuple({
      name: Cl.stringAscii(name),
      festival: Cl.stringAscii(festival),
      message: Cl.stringAscii(message),
      "image-uri": Cl.stringAscii(imageUri),
      "metadata-uri": Cl.stringAscii(metadataUri),
      sender: Cl.principal(wallet1),
      recipient: Cl.principal(recipient)
    })));
  });

  it("validates input parameters when minting", () => {
    const recipient = wallet2;

    // Test empty name
    const { result: emptyNameResult } = simnet.callPublicFn(
      "festies",
      "mint-greeting-card",
      [
        Cl.principal(recipient),
        Cl.stringAscii(""),
        Cl.stringAscii("Happy Birthday!"),
        Cl.stringAscii("Birthday"),
        Cl.stringAscii("https://example.com/image.png"),
        Cl.stringAscii("https://example.com/metadata.json")
      ],
      wallet1
    );
    expect(emptyNameResult).toBeErr(Cl.uint(102)); // err-invalid-input

    // Test empty message
    const { result: emptyMessageResult } = simnet.callPublicFn(
      "festies",
      "mint-greeting-card",
      [
        Cl.principal(recipient),
        Cl.stringAscii("Birthday Card"),
        Cl.stringAscii(""),
        Cl.stringAscii("Birthday"),
        Cl.stringAscii("https://example.com/image.png"),
        Cl.stringAscii("https://example.com/metadata.json")
      ],
      wallet1
    );
    expect(emptyMessageResult).toBeErr(Cl.uint(102)); // err-invalid-input
  });

  it("increments token IDs correctly", () => {
    const recipient = wallet2;
    const name = "Card";
    const message = "Hello!";
    const festival = "Festival";
    const imageUri = "https://example.com/image.png";
    const metadataUri = "https://example.com/metadata.json";

    // Mint first NFT
    const { result: firstMint } = simnet.callPublicFn(
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
      wallet1
    );
    expect(firstMint).toBeOk(Cl.uint(1));

    // Mint second NFT
    const { result: secondMint } = simnet.callPublicFn(
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
      wallet1
    );
    expect(secondMint).toBeOk(Cl.uint(2));
  });
});

describe("festies contract - Royalty Mechanism", () => {
  it("sets and gets royalty info (contract owner only)", () => {
    const newRecipient = wallet2;
    const newPercentage = 10;

    // Only contract owner can set royalty info
    const { result: setResult } = simnet.callPublicFn(
      "festies",
      "set-royalty-info",
      [Cl.principal(newRecipient), Cl.uint(newPercentage)],
      deployer
    );
    expect(setResult).toBeOk(Cl.bool(true));

    // Check the royalty info was set correctly
    const { result: getRoyaltyResult } = simnet.callReadOnlyFn(
      "festies",
      "get-royalty-info",
      [],
      deployer
    );
    expect(getRoyaltyResult).toBeOk(Cl.tuple({
      recipient: Cl.principal(newRecipient),
      percentage: Cl.uint(newPercentage)
    }));
  });

  it("prevents non-owner from setting royalty info", () => {
    const { result: setResult } = simnet.callPublicFn(
      "festies",
      "set-royalty-info",
      [Cl.principal(wallet2), Cl.uint(10)],
      wallet1
    );
    expect(setResult).toBeErr(Cl.uint(103)); // err-not-owner
  });

  it("validates royalty percentage is not over 100%", () => {
    const { result: setResult } = simnet.callPublicFn(
      "festies",
      "set-royalty-info",
      [Cl.principal(wallet2), Cl.uint(101)],
      deployer
    );
    expect(setResult).toBeErr(Cl.uint(102)); // err-invalid-input
  });

  it("calculates royalty correctly", () => {
    const salePrice = 1000;
    const { result: royaltyResult } = simnet.callReadOnlyFn(
      "festies",
      "calculate-royalty",
      [Cl.uint(salePrice)],
      deployer
    );
    // With default 5% royalty: 1000 * 5 / 100 = 50
    expect(royaltyResult).toBeOk(Cl.uint(50));
  });
});

describe("festies contract - Approval System", () => {
  beforeEach(() => {
    // Mint an NFT for testing
    simnet.callPublicFn(
      "festies",
      "mint-greeting-card",
      [
        Cl.principal(wallet2),
        Cl.stringAscii("Test Card"),
        Cl.stringAscii("Test Message"),
        Cl.stringAscii("Test Festival"),
        Cl.stringAscii("https://example.com/image.png"),
        Cl.stringAscii("https://example.com/metadata.json")
      ],
      wallet1
    );
  });

  it("allows owner to approve an operator", () => {
    const tokenId = Cl.uint(1);
    const operator = wallet3;

    // Owner approves operator
    const { result: approveResult } = simnet.callPublicFn(
      "festies",
      "approve",
      [tokenId, Cl.principal(operator)],
      wallet2 // wallet2 is the owner
    );
    expect(approveResult).toBeOk(Cl.bool(true));

    // Check that operator is approved
    const { result: getApprovedResult } = simnet.callReadOnlyFn(
      "festies",
      "get-approved",
      [tokenId],
      wallet1
    );
    expect(getApprovedResult).toBeOk(Cl.some(Cl.principal(operator)));
  });

  it("prevents non-owner from approving", () => {
    const tokenId = Cl.uint(1);
    const operator = wallet3;

    // Non-owner tries to approve
    const { result: approveResult } = simnet.callPublicFn(
      "festies",
      "approve",
      [tokenId, Cl.principal(operator)],
      wallet1 // wallet1 is not the owner
    );
    expect(approveResult).toBeErr(Cl.uint(101)); // err-not-token-owner
  });

  it("allows owner to revoke approval", () => {
    const tokenId = Cl.uint(1);
    const operator = wallet3;

    // First approve
    simnet.callPublicFn(
      "festies",
      "approve",
      [tokenId, Cl.principal(operator)],
      wallet2
    );

    // Then revoke
    const { result: revokeResult } = simnet.callPublicFn(
      "festies",
      "revoke-approval",
      [tokenId],
      wallet2
    );
    expect(revokeResult).toBeOk(Cl.bool(true));

    // Check that approval is revoked
    const { result: getApprovedResult } = simnet.callReadOnlyFn(
      "festies",
      "get-approved",
      [tokenId],
      wallet1
    );
    expect(getApprovedResult).toBeOk(Cl.none());
  });
});

describe("festies contract - Transfer Functionality", () => {
  beforeEach(() => {
    // Mint an NFT for testing
    simnet.callPublicFn(
      "festies",
      "mint-greeting-card",
      [
        Cl.principal(wallet2),
        Cl.stringAscii("Test Card"),
        Cl.stringAscii("Test Message"),
        Cl.stringAscii("Test Festival"),
        Cl.stringAscii("https://example.com/image.png"),
        Cl.stringAscii("https://example.com/metadata.json")
      ],
      wallet1
    );
  });

  it("allows owner to transfer NFT", () => {
    const tokenId = Cl.uint(1);

    // Owner transfers NFT
    const { result: transferResult } = simnet.callPublicFn(
      "festies",
      "transfer",
      [tokenId, Cl.principal(wallet2), Cl.principal(wallet3)],
      wallet2
    );
    expect(transferResult).toBeOk(Cl.bool(true));

    // Check new ownership
    const { result: ownerResult } = simnet.callReadOnlyFn(
      "festies",
      "get-owner",
      [tokenId],
      wallet1
    );
    expect(ownerResult).toBeOk(Cl.some(Cl.principal(wallet3)));
  });

  it("allows approved operator to transfer NFT", () => {
    const tokenId = Cl.uint(1);
    const operator = wallet3;

    // Owner approves operator
    simnet.callPublicFn(
      "festies",
      "approve",
      [tokenId, Cl.principal(operator)],
      wallet2
    );

    // Operator transfers NFT
    const { result: transferResult } = simnet.callPublicFn(
      "festies",
      "transfer",
      [tokenId, Cl.principal(wallet2), Cl.principal(wallet1)],
      operator
    );
    expect(transferResult).toBeOk(Cl.bool(true));

    // Check new ownership
    const { result: ownerResult } = simnet.callReadOnlyFn(
      "festies",
      "get-owner",
      [tokenId],
      wallet1
    );
    expect(ownerResult).toBeOk(Cl.some(Cl.principal(wallet1)));

    // Check that approval is cleared after transfer
    const { result: getApprovedResult } = simnet.callReadOnlyFn(
      "festies",
      "get-approved",
      [tokenId],
      wallet1
    );
    expect(getApprovedResult).toBeOk(Cl.none());
  });

  it("prevents unauthorized transfer", () => {
    const tokenId = Cl.uint(1);

    // Unauthorized user tries to transfer
    const { result: transferResult } = simnet.callPublicFn(
      "festies",
      "transfer",
      [tokenId, Cl.principal(wallet2), Cl.principal(wallet3)],
      wallet1 // wallet1 is not owner or approved
    );
    expect(transferResult).toBeErr(Cl.uint(101)); // err-not-token-owner
  });
});

describe("festies contract - Burn Functionality", () => {
  beforeEach(() => {
    // Mint an NFT for testing
    simnet.callPublicFn(
      "festies",
      "mint-greeting-card",
      [
        Cl.principal(wallet2),
        Cl.stringAscii("Test Card"),
        Cl.stringAscii("Test Message"),
        Cl.stringAscii("Test Festival"),
        Cl.stringAscii("https://example.com/image.png"),
        Cl.stringAscii("https://example.com/metadata.json")
      ],
      wallet1
    );
  });

  it("allows owner to burn NFT", () => {
    const tokenId = Cl.uint(1);

    // Owner burns NFT
    const { result: burnResult } = simnet.callPublicFn(
      "festies",
      "burn-greeting-card",
      [tokenId],
      wallet2
    );
    expect(burnResult).toBeOk(Cl.bool(true));

    // Check that NFT no longer exists
    const { result: ownerResult } = simnet.callReadOnlyFn(
      "festies",
      "get-owner",
      [tokenId],
      wallet1
    );
    expect(ownerResult).toBeOk(Cl.none());

    // Check that greeting data is deleted
    const { result: greetingResult } = simnet.callReadOnlyFn(
      "festies",
      "get-greeting-card",
      [tokenId],
      wallet1
    );
    expect(greetingResult).toBeErr(Cl.uint(404));
  });

  it("prevents non-owner from burning NFT", () => {
    const tokenId = Cl.uint(1);

    // Non-owner tries to burn
    const { result: burnResult } = simnet.callPublicFn(
      "festies",
      "burn-greeting-card",
      [tokenId],
      wallet1 // wallet1 is not the owner
    );
    expect(burnResult).toBeErr(Cl.uint(101)); // err-not-token-owner
  });

  it("handles burning non-existent token", () => {
    const nonExistentTokenId = Cl.uint(999);

    const { result: burnResult } = simnet.callPublicFn(
      "festies",
      "burn-greeting-card",
      [nonExistentTokenId],
      wallet1
    );
    expect(burnResult).toBeErr(Cl.uint(404));
  });
});

describe("festies contract - Edge Cases", () => {
  it("handles getting data for non-existent token", () => {
    const nonExistentTokenId = Cl.uint(999);

    // Test get-greeting-card
    const { result: greetingResult } = simnet.callReadOnlyFn(
      "festies",
      "get-greeting-card",
      [nonExistentTokenId],
      wallet1
    );
    expect(greetingResult).toBeErr(Cl.uint(404));

    // Test get-token-uri
    const { result: uriResult } = simnet.callReadOnlyFn(
      "festies",
      "get-token-uri",
      [nonExistentTokenId],
      wallet1
    );
    expect(uriResult).toBeOk(Cl.none());

    // Test get-owner
    const { result: ownerResult } = simnet.callReadOnlyFn(
      "festies",
      "get-owner",
      [nonExistentTokenId],
      wallet1
    );
    expect(ownerResult).toBeOk(Cl.none());
  });

  it("handles approval operations on non-existent token", () => {
    const nonExistentTokenId = Cl.uint(999);

    // Test approve
    const { result: approveResult } = simnet.callPublicFn(
      "festies",
      "approve",
      [nonExistentTokenId, Cl.principal(wallet3)],
      wallet1
    );
    expect(approveResult).toBeErr(Cl.uint(404));

    // Test revoke-approval
    const { result: revokeResult } = simnet.callPublicFn(
      "festies",
      "revoke-approval",
      [nonExistentTokenId],
      wallet1
    );
    expect(revokeResult).toBeErr(Cl.uint(404));
  });
});
