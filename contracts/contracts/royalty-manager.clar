;; ============================================================================
;; Royalty Manager Contract v1.0.0
;; ============================================================================
;; Manages royalty distribution for NFT sales
;; Handles royalty calculations and payments for secondary market sales
;; ============================================================================

(define-constant CONTRACT_NAME "Royalty Manager")
(define-constant CONTRACT_VERSION "1.0.0")
(define-constant CONTRACT_DESCRIPTION "Professional royalty management for NFT secondary sales")

;; ----------------------------------------------------------------------------
;; Error Constants
;; ----------------------------------------------------------------------------
(define-constant ERR_NOT_AUTHORIZED (err u401))
(define-constant ERR_INVALID_ROYALTY (err u402))
(define-constant ERR_INVALID_AMOUNT (err u403))
(define-constant ERR_PAYMENT_FAILED (err u404))

;; ----------------------------------------------------------------------------
;; Contract State
;; ----------------------------------------------------------------------------
(define-data-var contract-owner principal tx-sender)
(define-data-var default-royalty-percentage uint u5) ;; 5% default

;; Royalty configuration per NFT contract
(define-map contract-royalties principal (tuple (percentage uint) (recipient principal)))

;; Royalty payment history
(define-map royalty-payments uint (tuple 
    (contract principal)
    (token-id uint)
    (sale-price uint)
    (royalty-amount uint)
    (recipient principal)
    (paid-at uint)
))

;; Payment counter
(define-data-var total-payments uint u0)

;; ----------------------------------------------------------------------------
;; Contract Management
;; ----------------------------------------------------------------------------
(define-public (set-contract-owner (new-owner principal))
    (begin
        (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_NOT_AUTHORIZED)
        (var-set contract-owner new-owner)
        (print {event: "owner-updated", new-owner: new-owner, timestamp: block-height})
        (ok true)
    )
)

(define-public (set-default-royalty (percentage uint))
    (begin
        (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_NOT_AUTHORIZED)
        (asserts! (<= percentage u100) ERR_INVALID_ROYALTY)
        (var-set default-royalty-percentage percentage)
        (print {event: "default-royalty-updated", percentage: percentage, timestamp: block-height})
        (ok true)
    )
)

;; ----------------------------------------------------------------------------
;; Royalty Configuration
;; ----------------------------------------------------------------------------
(define-public (set-contract-royalty (nft-contract principal) (percentage uint) (recipient principal))
    (begin
        (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_NOT_AUTHORIZED)
        (asserts! (<= percentage u100) ERR_INVALID_ROYALTY)
        (map-set contract-royalties nft-contract (tuple (percentage percentage) (recipient recipient)))
        (print {
            event: "contract-royalty-set",
            contract: nft-contract,
            percentage: percentage,
            recipient: recipient,
            timestamp: block-height
        })
        (ok true)
    )
)

(define-read-only (get-contract-royalty (nft-contract principal))
    (ok (map-get? contract-royalties nft-contract))
)

(define-read-only (get-default-royalty)
    (ok (var-get default-royalty-percentage))
)

;; ----------------------------------------------------------------------------
;; Royalty Calculation
;; ----------------------------------------------------------------------------
(define-read-only (calculate-royalty (nft-contract principal) (sale-price uint))
    (let ((royalty-config (map-get? contract-royalties nft-contract)))
        (if (is-some royalty-config)
            (let ((config (unwrap! royalty-config ERR_INVALID_ROYALTY)))
                (let ((percentage (get percentage config)))
                    (ok (/ (* sale-price percentage) u100))
                )
            )
            (let ((default-percentage (var-get default-royalty-percentage)))
                (ok (/ (* sale-price default-percentage) u100))
            )
        )
    )
)

(define-read-only (calculate-royalty-detailed (nft-contract principal) (sale-price uint))
    (let ((royalty-config (map-get? contract-royalties nft-contract)))
        (if (is-some royalty-config)
            (let ((config (unwrap! royalty-config ERR_INVALID_ROYALTY)))
                (let (
                    (percentage (get percentage config))
                    (recipient (get recipient config))
                    (royalty-amount (/ (* sale-price percentage) u100))
                    (remaining-amount (- sale-price royalty-amount))
                )
                    (ok (tuple
                        (sale-price sale-price)
                        (royalty-percentage percentage)
                        (royalty-amount royalty-amount)
                        (remaining-amount remaining-amount)
                        (recipient recipient)
                    ))
                )
            )
            (let (
                (default-percentage (var-get default-royalty-percentage))
                (royalty-amount (/ (* sale-price default-percentage) u100))
                (remaining-amount (- sale-price royalty-amount))
            )
                (ok (tuple
                    (sale-price sale-price)
                    (royalty-percentage default-percentage)
                    (royalty-amount royalty-amount)
                    (remaining-amount remaining-amount)
                    (recipient (var-get contract-owner))
                ))
            )
        )
    )
)

;; ----------------------------------------------------------------------------
;; Royalty Payment
;; ----------------------------------------------------------------------------
(define-public (pay-royalty (nft-contract principal) (token-id uint) (sale-price uint) (seller principal))
    (let ((royalty-config (map-get? contract-royalties nft-contract)))
        (if (is-some royalty-config)
            (let ((config (unwrap! royalty-config ERR_INVALID_ROYALTY)))
                (let (
                    (percentage (get percentage config))
                    (recipient (get recipient config))
                    (royalty-amount (/ (* sale-price percentage) u100))
                )
                    (begin
                        (asserts! (> sale-price u0) ERR_INVALID_AMOUNT)
                        (asserts! (> royalty-amount u0) ERR_INVALID_AMOUNT)
                        
                        ;; Transfer royalty to recipient
                        (try! (stx-transfer? royalty-amount tx-sender recipient))
                        
                        ;; Record payment
                        (let ((payment-id (var-get total-payments)))
                            (begin
                                (map-set royalty-payments payment-id (tuple
                                    (contract nft-contract)
                                    (token-id token-id)
                                    (sale-price sale-price)
                                    (royalty-amount royalty-amount)
                                    (recipient recipient)
                                    (paid-at block-height)
                                ))
                                (var-set total-payments (+ payment-id u1))
                                
                                ;; Emit event
                                (print {
                                    event: "royalty-paid",
                                    contract: nft-contract,
                                    token-id: token-id,
                                    sale-price: sale-price,
                                    royalty-amount: royalty-amount,
                                    recipient: recipient,
                                    timestamp: block-height
                                })
                                
                                (ok true)
                            )
                        )
                    )
                )
            )
            (err ERR_INVALID_ROYALTY)
        )
    )
)

;; ----------------------------------------------------------------------------
;; Read-Only Functions
;; ----------------------------------------------------------------------------
(define-read-only (get-royalty-payment (payment-id uint))
    (ok (map-get? royalty-payments payment-id))
)

(define-read-only (get-total-payments)
    (ok (var-get total-payments))
)

(define-read-only (get-contract-info)
    (ok (tuple
        (name CONTRACT_NAME)
        (version CONTRACT_VERSION)
        (description CONTRACT_DESCRIPTION)
        (owner (var-get contract-owner))
        (default-royalty (var-get default-royalty-percentage))
        (total-payments (var-get total-payments))
    ))
)
// Refactor improvement
