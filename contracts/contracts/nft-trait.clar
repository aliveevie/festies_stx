;; Enhanced NFT Trait for Festival Greetings
;; Implements comprehensive NFT standards with metadata and approval support

(define-trait nft-trait
  (
    ;; Token enumeration
    (get-last-token-id () (response uint uint))
    (get-total-supply () (response uint uint))
    
    ;; Token ownership and transfer
    (get-owner (uint) (response (optional principal) uint))
    (get-token-uri (uint) (response (optional (string-ascii 500)) uint))
    (transfer (uint principal principal) (response bool uint))
    
    ;; Approval system
    (get-approved (uint) (response (optional principal) uint))
    (approve (uint principal) (response bool uint))
    (revoke-approval (uint) (response bool uint))
    
    ;; Metadata and information
    (get-token-metadata (uint) (response (optional (tuple (name (string-ascii 40)) (festival (string-ascii 100)) (message (string-ascii 500)) (image-uri (string-ascii 500)) (metadata-uri (string-ascii 500)) (sender principal) (recipient principal) (created-at uint))) uint))
    
    ;; Royalty information
    (get-royalty-info () (response (tuple (recipient principal) (percentage uint)) uint))
    (calculate-royalty (uint) (response uint uint))
    
    ;; Contract management
    (get-contract-owner () (response principal uint))
    (get-contract-info () (response (tuple (name (string-ascii 50)) (symbol (string-ascii 10)) (version (string-ascii 20)) (description (string-ascii 200))) uint))
  )
) 