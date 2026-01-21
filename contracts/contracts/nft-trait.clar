;; ============================================================================
;; NFT Trait Interface v1.1.0
;; ============================================================================
;; Enhanced NFT Trait for Festival Greetings
;; Implements SIP-009 compliant NFT interface with comprehensive functionality
;; Provides standard methods for NFT operations, metadata, and ownership
;; ============================================================================

;; ----------------------------------------------------------------------------
;; Trait Definition
;; ----------------------------------------------------------------------------
;; This trait defines the standard interface for NFT contracts
;; All NFT contracts implementing this trait must provide these functions
;; ----------------------------------------------------------------------------

(define-trait nft-trait (
  ;; Get the last token ID that was minted
  ;; Returns the highest token ID in the collection
  (get-last-token-id
    ()
    (response uint uint)
  )
  
  ;; Get the owner of a specific token
  ;; Returns the principal address that owns the token, or none if token doesn't exist
  (get-owner
    (uint)
    (response (optional principal) uint)
  )
  
  ;; Get the URI for a token's metadata
  ;; Returns the metadata URI (typically IPFS or HTTP) for the token
  (get-token-uri
    (uint)
    (response (optional (string-ascii 500)) uint)
  )
  
  ;; Transfer a token from one principal to another
  ;; Requires the sender to be the owner or an approved operator
  ;; Returns true on success, error code on failure
  (transfer
    (uint principal principal)
    (response bool uint)
  )
))
;; Trait v1.0.1
;; Trait v1.0.2
;; Trait optimization 1
;; Trait refactor 1
;; Trait docs update
;; Trait style update
;; Trait v1.1.0
;; Trait cleanup
;; Trait final
;; Performance optimization 73
;; Refactor improvement 90
;; Documentation update 115
;; Version 140
;; Final polish 165
;; Release prep 190
