/// <reference path="./clarinet-env.d.ts" />
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

// Test data constants
const TEST_NAME = "Birthday Card";
const TEST_MESSAGE = "Happy Birthday!";
const TEST_FESTIVAL = "Birthday";
const TEST_IMAGE_URI = "https://example.com/image.png";
const TEST_METADATA_URI = "https://example.com/metadata.json";

describe("Festies NFT Contract - Professional Test Suite", () => {
  describe("Contract Initialization", () => {
    it("ensures simnet is well initialized", () => {
      expect(simnet.blockHeight).toBeDefined();
    });

    it("returns correct contract information", () => {
      const { result } = simnet.callReadOnlyFn(
        "festies",
        "get-contract-info",
        [],
        deployer
      );
      
      expect(result).toBeOk(Cl.tuple({
        name: Cl.stringAscii("Festival Greetings"),
        symbol: Cl.stringAscii("FESTIE"),
        version: Cl.stringAscii("2.3.0"),
        description: Cl.stringAscii("Professional NFT contract for festival greetings with royalty support and advanced features - Updated for Clarity 4")
      }));
    });

    it("returns correct contract owner", () => {
      const { result } = simnet.callReadOnlyFn(
        "festies",
        "get-contract-owner",
        [],
        deployer
      );
      
      expect(result).toBeOk(Cl.principal(deployer));
    });

    it("returns correct contract status", () => {
      const currentBlock = simnet.blockHeight;
      const { result } = simnet.callReadOnlyFn(
        "festies",
        "get-contract-status",
        [],
        deployer
      );
      
      expect(result).toBeOk(Cl.tuple({
        owner: Cl.principal(deployer),
        paused: Cl.bool(false),
        "total-supply": Cl.uint(0),
        "next-token-id": Cl.uint(1),
        "royalty-percentage": Cl.uint(5),
        "royalty-recipient": Cl.principal(deployer),
        "current-block-time": Cl.uint(currentBlock)
      }));
    });
  });

  describe("NFT Minting Functionality", () => {
    it("mints a greeting card NFT with correct metadata", () => {
      const recipient = wallet2;

      const { result: mintResult } = simnet.callPublicFn(
        "festies",
        "mint-greeting-card",
        [
          Cl.principal(recipient),
          Cl.stringAscii(TEST_NAME),
          Cl.stringAscii(TEST_MESSAGE),
          Cl.stringAscii(TEST_FESTIVAL),
          Cl.stringAscii(TEST_IMAGE_URI),
          Cl.stringAscii(TEST_METADATA_URI)
        ],
        wallet1
      );
      
      expect(mintResult).toBeOk(Cl.uint(1));
      const mintedAt = simnet.blockHeight;
      
      const tokenId = Cl.uint(1);

      // Verify token URI
      const { result: uriResult } = simnet.callReadOnlyFn(
        "festies",
        "get-token-uri",
        [tokenId],
        wallet1
      );
      expect(uriResult).toBeOk(Cl.some(Cl.stringAscii(TEST_METADATA_URI)));

      // Verify ownership
      const { result: ownerResult } = simnet.callReadOnlyFn(
        "festies",
        "get-owner",
        [tokenId],
        wallet1
      );
      expect(ownerResult).toBeOk(Cl.some(Cl.principal(recipient)));

      // Verify complete metadata
      const { result: metadataResult } = simnet.callReadOnlyFn(
        "festies",
        "get-token-metadata",
        [tokenId],
        wallet1
      );
      
      expect(metadataResult).toBeOk(Cl.some(Cl.tuple({
        name: Cl.stringAscii(TEST_NAME),
        festival: Cl.stringAscii(TEST_FESTIVAL),
        message: Cl.stringAscii(TEST_MESSAGE),
        "image-uri": Cl.stringAscii(TEST_IMAGE_URI),
        "metadata-uri": Cl.stringAscii(TEST_METADATA_URI),
        sender: Cl.principal(wallet1),
        recipient: Cl.principal(recipient),
        "created-at": Cl.uint(mintedAt)
      })));

      // Verify total supply increased
      const { result: supplyResult } = simnet.callReadOnlyFn(
        "festies",
        "get-total-supply",
        [],
        wallet1
      );
      expect(supplyResult).toBeOk(Cl.uint(1));
    });

    it("validates all input parameters when minting", () => {
      const recipient = wallet2;

      // Test empty name
      const { result: emptyNameResult } = simnet.callPublicFn(
        "festies",
        "mint-greeting-card",
        [
          Cl.principal(recipient),
          Cl.stringAscii(""),
          Cl.stringAscii(TEST_MESSAGE),
          Cl.stringAscii(TEST_FESTIVAL),
          Cl.stringAscii(TEST_IMAGE_URI),
          Cl.stringAscii(TEST_METADATA_URI)
        ],
        wallet1
      );
      expect(emptyNameResult).toBeErr(Cl.uint(102)); // ERR_INVALID_INPUT

      // Test empty message
      const { result: emptyMessageResult } = simnet.callPublicFn(
        "festies",
        "mint-greeting-card",
        [
          Cl.principal(recipient),
          Cl.stringAscii(TEST_NAME),
          Cl.stringAscii(""),
          Cl.stringAscii(TEST_FESTIVAL),
          Cl.stringAscii(TEST_IMAGE_URI),
          Cl.stringAscii(TEST_METADATA_URI)
        ],
        wallet1
      );
      expect(emptyMessageResult).toBeErr(Cl.uint(102)); // ERR_INVALID_INPUT

      // Test empty festival
      const { result: emptyFestivalResult } = simnet.callPublicFn(
        "festies",
        "mint-greeting-card",
        [
          Cl.principal(recipient),
          Cl.stringAscii(TEST_NAME),
          Cl.stringAscii(TEST_MESSAGE),
          Cl.stringAscii(""),
          Cl.stringAscii(TEST_IMAGE_URI),
          Cl.stringAscii(TEST_METADATA_URI)
        ],
        wallet1
      );
      expect(emptyFestivalResult).toBeErr(Cl.uint(102)); // ERR_INVALID_INPUT

      // Test empty image URI
      const { result: emptyImageResult } = simnet.callPublicFn(
        "festies",
        "mint-greeting-card",
        [
          Cl.principal(recipient),
          Cl.stringAscii(TEST_NAME),
          Cl.stringAscii(TEST_MESSAGE),
          Cl.stringAscii(TEST_FESTIVAL),
          Cl.stringAscii(""),
          Cl.stringAscii(TEST_METADATA_URI)
        ],
        wallet1
      );
      expect(emptyImageResult).toBeErr(Cl.uint(102)); // ERR_INVALID_INPUT

      // Test empty metadata URI
      const { result: emptyMetadataResult } = simnet.callPublicFn(
        "festies",
        "mint-greeting-card",
        [
          Cl.principal(recipient),
          Cl.stringAscii(TEST_NAME),
          Cl.stringAscii(TEST_MESSAGE),
          Cl.stringAscii(TEST_FESTIVAL),
          Cl.stringAscii(TEST_IMAGE_URI),
          Cl.stringAscii("")
        ],
        wallet1
      );
      expect(emptyMetadataResult).toBeErr(Cl.uint(102)); // ERR_INVALID_INPUT
    });

    it("increments token IDs and total supply correctly", () => {
      const recipient = wallet2;

      // Mint first NFT
      const { result: firstMint } = simnet.callPublicFn(
        "festies",
        "mint-greeting-card",
        [
          Cl.principal(recipient),
          Cl.stringAscii(TEST_NAME),
          Cl.stringAscii(TEST_MESSAGE),
          Cl.stringAscii(TEST_FESTIVAL),
          Cl.stringAscii(TEST_IMAGE_URI),
          Cl.stringAscii(TEST_METADATA_URI)
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
          Cl.stringAscii(TEST_NAME),
          Cl.stringAscii(TEST_MESSAGE),
          Cl.stringAscii(TEST_FESTIVAL),
          Cl.stringAscii(TEST_IMAGE_URI),
          Cl.stringAscii(TEST_METADATA_URI)
        ],
        wallet1
      );
      expect(secondMint).toBeOk(Cl.uint(2));

      // Verify total supply
      const { result: supplyResult } = simnet.callReadOnlyFn(
        "festies",
        "get-total-supply",
        [],
        wallet1
      );
      expect(supplyResult).toBeOk(Cl.uint(2));

      // Verify next token ID
      const { result: nextIdResult } = simnet.callReadOnlyFn(
        "festies",
        "get-last-token-id",
        [],
        wallet1
      );
      expect(nextIdResult).toBeOk(Cl.uint(3));
    });

    it("supports batch minting operations", () => {
      const recipients = [wallet2, wallet3];

      const { result: batchResult } = simnet.callPublicFn(
        "festies",
        "batch-mint-greeting-cards",
        [
          Cl.list([
            Cl.tuple({
              recipient: Cl.principal(recipients[0]),
              name: Cl.stringAscii("Card 1"),
              message: Cl.stringAscii("Message 1"),
              festival: Cl.stringAscii("Festival 1"),
              "image-uri": Cl.stringAscii("https://example.com/image1.png"),
              "metadata-uri": Cl.stringAscii("https://example.com/metadata1.json")
            }),
            Cl.tuple({
              recipient: Cl.principal(recipients[1]),
              name: Cl.stringAscii("Card 2"),
              message: Cl.stringAscii("Message 2"),
              festival: Cl.stringAscii("Festival 2"),
              "image-uri": Cl.stringAscii("https://example.com/image2.png"),
              "metadata-uri": Cl.stringAscii("https://example.com/metadata2.json")
            })
          ])
        ],
        wallet1
      );

      expect(batchResult).toBeOk(Cl.list([Cl.uint(1), Cl.uint(2)]));

      // Verify total supply after batch mint
      const { result: supplyResult } = simnet.callReadOnlyFn(
        "festies",
        "get-total-supply",
        [],
        wallet1
      );
      expect(supplyResult).toBeOk(Cl.uint(2));
    });
  });

  describe("Royalty System", () => {
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
      expect(setResult).toBeErr(Cl.uint(403)); // ERR_OWNER_ONLY
    });

    it("validates royalty percentage is not over 100%", () => {
      const { result: setResult } = simnet.callPublicFn(
        "festies",
        "set-royalty-info",
        [Cl.principal(wallet2), Cl.uint(101)],
        deployer
      );
      expect(setResult).toBeErr(Cl.uint(105)); // ERR_INVALID_ROYALTY
    });

    it("calculates royalty correctly", () => {
      const salePrice = 1000;
      const { result: royaltyResult } = simnet.callReadOnlyFn(
        "festies",
        "calculate-royalty",
        [Cl.uint(salePrice)],
        deployer
      );
      
      // Default royalty is 5%
      expect(royaltyResult).toBeOk(Cl.uint(50));
    });
  });

  describe("Approval System", () => {
    beforeEach(() => {
      // Mint an NFT for testing
      simnet.callPublicFn(
        "festies",
        "mint-greeting-card",
        [
          Cl.principal(wallet1),
          Cl.stringAscii(TEST_NAME),
          Cl.stringAscii(TEST_MESSAGE),
          Cl.stringAscii(TEST_FESTIVAL),
          Cl.stringAscii(TEST_IMAGE_URI),
          Cl.stringAscii(TEST_METADATA_URI)
        ],
        wallet1
      );
    });

    it("allows token owner to approve operator", () => {
      const tokenId = Cl.uint(1);
      const operator = wallet2;

      const { result: approveResult } = simnet.callPublicFn(
        "festies",
        "approve",
        [tokenId, Cl.principal(operator)],
        wallet1
      );
      
      expect(approveResult).toBeOk(Cl.bool(true));

      // Verify approval was set
      const { result: approvedResult } = simnet.callReadOnlyFn(
        "festies",
        "get-approved",
        [tokenId],
        wallet1
      );
      expect(approvedResult).toBeOk(Cl.some(Cl.principal(operator)));
    });

    it("prevents non-owner from approving operator", () => {
      const tokenId = Cl.uint(1);
      const operator = wallet2;

      const { result: approveResult } = simnet.callPublicFn(
        "festies",
        "approve",
        [tokenId, Cl.principal(operator)],
        wallet2
      );
      
      expect(approveResult).toBeErr(Cl.uint(101)); // ERR_NOT_TOKEN_OWNER
    });

    it("allows token owner to revoke approval", () => {
      const tokenId = Cl.uint(1);
      const operator = wallet2;

      // First approve
      simnet.callPublicFn(
        "festies",
        "approve",
        [tokenId, Cl.principal(operator)],
        wallet1
      );

      // Then revoke
      const { result: revokeResult } = simnet.callPublicFn(
        "festies",
        "revoke-approval",
        [tokenId],
        wallet1
      );
      
      expect(revokeResult).toBeOk(Cl.bool(true));

      // Verify approval was revoked
      const { result: approvedResult } = simnet.callReadOnlyFn(
        "festies",
        "get-approved",
        [tokenId],
        wallet1
      );
      expect(approvedResult).toBeOk(Cl.none());
    });

    it("allows approved operator to transfer token", () => {
      const tokenId = Cl.uint(1);
      const operator = wallet2;
      const recipient = wallet3;

      // Approve operator
      simnet.callPublicFn(
        "festies",
        "approve",
        [tokenId, Cl.principal(operator)],
        wallet1
      );

      // Transfer by approved operator
      const { result: transferResult } = simnet.callPublicFn(
        "festies",
        "transfer",
        [tokenId, Cl.principal(wallet1), Cl.principal(recipient)],
        operator
      );
      
      expect(transferResult).toBeOk(Cl.bool(true));

      // Verify ownership changed
      const { result: ownerResult } = simnet.callReadOnlyFn(
        "festies",
        "get-owner",
        [tokenId],
        operator
      );
      expect(ownerResult).toBeOk(Cl.some(Cl.principal(recipient)));

      // Verify approval was cleared
      const { result: approvedResult } = simnet.callReadOnlyFn(
        "festies",
        "get-approved",
        [tokenId],
        operator
      );
      expect(approvedResult).toBeOk(Cl.none());
    });
  });

  describe("Transfer Functionality", () => {
    beforeEach(() => {
      // Mint an NFT for testing
      simnet.callPublicFn(
        "festies",
        "mint-greeting-card",
        [
          Cl.principal(wallet1),
          Cl.stringAscii(TEST_NAME),
          Cl.stringAscii(TEST_MESSAGE),
          Cl.stringAscii(TEST_FESTIVAL),
          Cl.stringAscii(TEST_IMAGE_URI),
          Cl.stringAscii(TEST_METADATA_URI)
        ],
        wallet1
      );
    });

    it("allows token owner to transfer token", () => {
      const tokenId = Cl.uint(1);
      const recipient = wallet2;

      const { result: transferResult } = simnet.callPublicFn(
        "festies",
        "transfer",
        [tokenId, Cl.principal(wallet1), Cl.principal(recipient)],
        wallet1
      );
      
      expect(transferResult).toBeOk(Cl.bool(true));

      // Verify ownership changed
      const { result: ownerResult } = simnet.callReadOnlyFn(
        "festies",
        "get-owner",
        [tokenId],
        wallet1
      );
      expect(ownerResult).toBeOk(Cl.some(Cl.principal(recipient)));
    });

    it("prevents non-owner from transferring token", () => {
      const tokenId = Cl.uint(1);
      const recipient = wallet3;

      const { result: transferResult } = simnet.callPublicFn(
        "festies",
        "transfer",
        [tokenId, Cl.principal(wallet1), Cl.principal(recipient)],
        wallet2
      );
      
      expect(transferResult).toBeErr(Cl.uint(101)); // ERR_NOT_TOKEN_OWNER
    });
  });

  describe("Burning Functionality", () => {
    beforeEach(() => {
      // Mint an NFT for testing
      simnet.callPublicFn(
        "festies",
        "mint-greeting-card",
        [
          Cl.principal(wallet1),
          Cl.stringAscii(TEST_NAME),
          Cl.stringAscii(TEST_MESSAGE),
          Cl.stringAscii(TEST_FESTIVAL),
          Cl.stringAscii(TEST_IMAGE_URI),
          Cl.stringAscii(TEST_METADATA_URI)
        ],
        wallet1
      );
    });

    it("allows token owner to burn token", () => {
      const tokenId = Cl.uint(1);

      const { result: burnResult } = simnet.callPublicFn(
        "festies",
        "burn-greeting-card",
        [tokenId],
        wallet1
      );
      
      expect(burnResult).toBeOk(Cl.bool(true));

      // Verify token was burned
      const { result: ownerResult } = simnet.callReadOnlyFn(
        "festies",
        "get-owner",
        [tokenId],
        wallet1
      );
      expect(ownerResult).toBeOk(Cl.none());

      // Verify total supply decreased
      const { result: supplyResult } = simnet.callReadOnlyFn(
        "festies",
        "get-total-supply",
        [],
        wallet1
      );
      expect(supplyResult).toBeOk(Cl.uint(0));
    });

    it("prevents non-owner from burning token", () => {
      const tokenId = Cl.uint(1);

      const { result: burnResult } = simnet.callPublicFn(
        "festies",
        "burn-greeting-card",
        [tokenId],
        wallet2
      );
      
      expect(burnResult).toBeErr(Cl.uint(101)); // ERR_NOT_TOKEN_OWNER
    });
  });

  describe("Contract Management", () => {
    it("allows contract owner to change ownership", () => {
      const newOwner = wallet2;

      const { result: changeResult } = simnet.callPublicFn(
        "festies",
        "set-contract-owner",
        [Cl.principal(newOwner)],
        deployer
      );
      
      expect(changeResult).toBeOk(Cl.bool(true));

      // Verify ownership changed
      const { result: ownerResult } = simnet.callReadOnlyFn(
        "festies",
        "get-contract-owner",
        [],
        deployer
      );
      expect(ownerResult).toBeOk(Cl.principal(newOwner));
    });

    it("prevents non-owner from changing ownership", () => {
      const newOwner = wallet3;

      const { result: changeResult } = simnet.callPublicFn(
        "festies",
        "set-contract-owner",
        [Cl.principal(newOwner)],
        wallet1
      );
      
      expect(changeResult).toBeErr(Cl.uint(403)); // ERR_OWNER_ONLY
    });

    it("allows contract owner to pause and unpause contract", () => {
      // Pause contract
      const { result: pauseResult } = simnet.callPublicFn(
        "festies",
        "pause-contract",
        [],
        deployer
      );
      expect(pauseResult).toBeOk(Cl.bool(true));

      // Verify contract is paused
      const pausedBlock = simnet.blockHeight;
      const { result: statusResult } = simnet.callReadOnlyFn(
        "festies",
        "get-contract-status",
        [],
        deployer
      );
      expect(statusResult).toBeOk(Cl.tuple({
        owner: Cl.principal(deployer),
        paused: Cl.bool(true),
        "total-supply": Cl.uint(0),
        "next-token-id": Cl.uint(1),
        "royalty-percentage": Cl.uint(5),
        "royalty-recipient": Cl.principal(deployer),
        "current-block-time": Cl.uint(pausedBlock)
      }));

      // Unpause contract
      const { result: unpauseResult } = simnet.callPublicFn(
        "festies",
        "unpause-contract",
        [],
        deployer
      );
      expect(unpauseResult).toBeOk(Cl.bool(true));

      // Verify contract is unpaused
      const unpausedBlock = simnet.blockHeight;
      const { result: statusResult2 } = simnet.callReadOnlyFn(
        "festies",
        "get-contract-status",
        [],
        deployer
      );
      expect(statusResult2).toBeOk(Cl.tuple({
        owner: Cl.principal(deployer),
        paused: Cl.bool(false),
        "total-supply": Cl.uint(0),
        "next-token-id": Cl.uint(1),
        "royalty-percentage": Cl.uint(5),
        "royalty-recipient": Cl.principal(deployer),
        "current-block-time": Cl.uint(unpausedBlock)
      }));
    });

    it("prevents operations when contract is paused", () => {
      // Pause contract
      simnet.callPublicFn(
        "festies",
        "pause-contract",
        [],
        deployer
      );

      // Try to mint when paused
      const { result: mintResult } = simnet.callPublicFn(
        "festies",
        "mint-greeting-card",
        [
          Cl.principal(wallet2),
          Cl.stringAscii(TEST_NAME),
          Cl.stringAscii(TEST_MESSAGE),
          Cl.stringAscii(TEST_FESTIVAL),
          Cl.stringAscii(TEST_IMAGE_URI),
          Cl.stringAscii(TEST_METADATA_URI)
        ],
        wallet1
      );
      
      expect(mintResult).toBeErr(Cl.uint(103)); // ERR_NOT_AUTHORIZED
    });
  });

  describe("Error Handling and Edge Cases", () => {
    it("handles non-existent token operations gracefully", () => {
      const nonExistentTokenId = Cl.uint(999);

      // Try to get owner of non-existent token
      const { result: ownerResult } = simnet.callReadOnlyFn(
        "festies",
        "get-owner",
        [nonExistentTokenId],
        wallet1
      );
      expect(ownerResult).toBeOk(Cl.none());

      // Try to get metadata of non-existent token
      const { result: metadataResult } = simnet.callReadOnlyFn(
        "festies",
        "get-token-metadata",
        [nonExistentTokenId],
        wallet1
      );
      expect(metadataResult).toBeErr(Cl.uint(104)); // ERR_TOKEN_NOT_FOUND
    });

    it("maintains data consistency across operations", () => {
      const recipient = wallet2;

      // Mint NFT
      const { result: mintResult } = simnet.callPublicFn(
        "festies",
        "mint-greeting-card",
        [
          Cl.principal(recipient),
          Cl.stringAscii(TEST_NAME),
          Cl.stringAscii(TEST_MESSAGE),
          Cl.stringAscii(TEST_FESTIVAL),
          Cl.stringAscii(TEST_IMAGE_URI),
          Cl.stringAscii(TEST_METADATA_URI)
        ],
        wallet1
      );
      
      const tokenId = Cl.uint(1);
      expect(mintResult).toBeOk(tokenId);
      const mintedAt = simnet.blockHeight;

      // Verify all data is consistent
      const { result: metadataResult } = simnet.callReadOnlyFn(
        "festies",
        "get-token-metadata",
        [tokenId],
        wallet1
      );
      
      expect(metadataResult).toBeOk(Cl.some(Cl.tuple({
        name: Cl.stringAscii(TEST_NAME),
        festival: Cl.stringAscii(TEST_FESTIVAL),
        message: Cl.stringAscii(TEST_MESSAGE),
        "image-uri": Cl.stringAscii(TEST_IMAGE_URI),
        "metadata-uri": Cl.stringAscii(TEST_METADATA_URI),
        sender: Cl.principal(wallet1),
        recipient: Cl.principal(recipient),
        "created-at": Cl.uint(mintedAt)
      })));

      // Burn token
      simnet.callPublicFn(
        "festies",
        "burn-greeting-card",
        [tokenId],
        recipient
      );

      // Verify token is completely removed
      const { result: ownerResult } = simnet.callReadOnlyFn(
        "festies",
        "get-owner",
        [tokenId],
        wallet1
      );
      expect(ownerResult).toBeOk(Cl.none());

      const { result: metadataResult2 } = simnet.callReadOnlyFn(
        "festies",
        "get-token-metadata",
        [tokenId],
        wallet1
      );
      expect(metadataResult2).toBeErr(Cl.uint(104)); // ERR_TOKEN_NOT_FOUND
    });
  });
});
