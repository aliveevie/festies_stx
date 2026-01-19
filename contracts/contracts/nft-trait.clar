;; Enhanced NFT Trait for Festival Greetings v1.0.0
;; Implements SIP-009 compliant NFT interface
;; Provides standard methods for NFT operations

(define-trait nft-trait (
  (get-last-token-id
    ()
    (response uint uint)
  )
  (get-owner
    (uint)
    (response (optional principal) uint)
  )
  (get-token-uri
    (uint)
    (response (optional (string-ascii 500)) uint)
  )
  (transfer
    (uint principal principal)
    (response bool uint)
  )
  
))
// Trait v1.0.1
// Trait v1.0.2
// Trait optimization 1
// Trait refactor 1
// Trait docs update
// Trait style update
// Trait v1.1.0
// Trait cleanup
