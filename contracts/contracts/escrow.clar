;; Escrow Contract for Festies NFT Marketplace
;; Handles secure escrow transactions for NFT sales

(define-constant contract-owner tx-sender)
(define-constant escrow-fee (u 25)) ;; 0.25% fee (25 basis points)
(define-constant min-escrow-duration (u 3600)) ;; 1 hour in seconds
(define-constant max-escrow-duration (u 2592000)) ;; 30 days in seconds

(define-map escrows
  {escrow-id: uint}
  {
    seller: principal,
    buyer: principal,
    nft-contract: principal,
    token-id: uint,
    price: uint,
    expires-at: uint,
    status: (string-ascii 20),
    created-at: uint
  }
)

(define-data-var escrow-counter uint u0)

;; Get next escrow ID
(define-private (next-escrow-id)
  (let ((id (var-get escrow-counter)))
    (var-set escrow-counter (+ id u1))
    id
))

;; Create new escrow
(define-public (create-escrow
    (seller principal)
    (buyer principal)
    (nft-contract principal)
    (token-id uint)
    (price uint)
    (duration uint))
  (begin
    (asserts! (is-eq tx-sender seller) (err u1001))
    (asserts! (> duration min-escrow-duration) (err u1002))
    (asserts! (< duration max-escrow-duration) (err u1003))
    
    (let ((escrow-id (next-escrow-id))
          (expires-at (+ (block-height) duration))
          (fee (to-uint (/ (* price escrow-fee) u10000))))
      
      ;; Transfer NFT to escrow contract
      (try! (contract-call? nft-contract transfer u0 seller contract-owner token-id))
      
      ;; Store escrow details
      (map-set escrows
        {escrow-id: escrow-id}
        {
          seller: seller,
          buyer: buyer,
          nft-contract: nft-contract,
          token-id: token-id,
          price: price,
          expires-at: expires-at,
          status: "pending",
          created-at: (block-height)
        }
      )
      
      (ok escrow-id)
    )
))

;; Complete escrow - buyer confirms receipt
(define-public (complete-escrow (escrow-id uint))
  (begin
    (asserts! (is-some (map-get? escrows {escrow-id: escrow-id})) (err u2001))
    
    (let ((escrow (unwrap-panic (map-get? escrows {escrow-id: escrow-id}))))
      (asserts! (is-eq tx-sender (get buyer escrow)) (err u2002))
      (asserts! (is-eq (get status escrow) "pending") (err u2003))
      
      (let ((price (get price escrow))
            (fee (to-uint (/ (* price escrow-fee) u10000)))
            (seller-amount (- price fee))
            (nft-contract (get nft-contract escrow))
            (token-id (get token-id escrow))
            (buyer (get buyer escrow))
            (seller (get seller escrow)))
        
        ;; Transfer NFT to buyer
        (try! (contract-call? nft-contract transfer u0 contract-owner buyer token-id))
        
        ;; Transfer payment to seller (minus fee)
        (try! (stx-transfer? seller-amount tx-sender seller))
        
        ;; Transfer fee to contract owner
        (try! (stx-transfer? fee tx-sender contract-owner))
        
        ;; Update escrow status
        (map-set escrows
          {escrow-id: escrow-id}
          (merge escrow {status: "completed"})
        )
        
        (ok true)
      )
    )
))

;; Cancel escrow - seller cancels before completion
(define-public (cancel-escrow (escrow-id uint))
  (begin
    (asserts! (is-some (map-get? escrows {escrow-id: escrow-id})) (err u3001))
    
    (let ((escrow (unwrap-panic (map-get? escrows {escrow-id: escrow-id}))))
      (asserts! (is-eq tx-sender (get seller escrow)) (err u3002))
      (asserts! (is-eq (get status escrow) "pending") (err u3003))
      
      (let ((nft-contract (get nft-contract escrow))
            (token-id (get token-id escrow))
            (seller (get seller escrow)))
        
        ;; Return NFT to seller
        (try! (contract-call? nft-contract transfer u0 contract-owner seller token-id))
        
        ;; Update escrow status
        (map-set escrows
          {escrow-id: escrow-id}
          (merge escrow {status: "cancelled"})
        )
        
        (ok true)
      )
    )
))

;; Release expired escrow - return NFT to seller
(define-public (release-expired (escrow-id uint))
  (begin
    (asserts! (is-some (map-get? escrows {escrow-id: escrow-id})) (err u4001))
    
    (let ((escrow (unwrap-panic (map-get? escrows {escrow-id: escrow-id}))))
      (asserts! (is-eq (get status escrow) "pending") (err u4002))
      (asserts! (> (block-height) (get expires-at escrow)) (err u4003))
      
      (let ((nft-contract (get nft-contract escrow))
            (token-id (get token-id escrow))
            (seller (get seller escrow)))
        
        ;; Return NFT to seller
        (try! (contract-call? nft-contract transfer u0 contract-owner seller token-id))
        
        ;; Update escrow status
        (map-set escrows
          {escrow-id: escrow-id}
          (merge escrow {status: "expired"})
        )
        
        (ok true)
      )
    )
))

;; Get escrow details
(define-read-only (get-escrow (escrow-id uint))
  (map-get? escrows {escrow-id: escrow-id})
)

;; Get escrow count
(define-read-only (get-escrow-count)
  (var-get escrow-counter)
)
;; Style improvement
// Refactor improvement
