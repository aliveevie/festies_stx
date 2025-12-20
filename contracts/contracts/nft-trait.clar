;; Enhanced NFT Trait for Festival Greetings
;; Implements comprehensive NFT standards with metadata and approval support

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
