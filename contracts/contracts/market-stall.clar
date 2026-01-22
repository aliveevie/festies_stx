;; ============================================================================
;; Market Stall Contract v1.1.0
;; ============================================================================
;; Professional marketplace contract for Festies NFT trading
;; Enables secure listing, purchasing, and management of greeting card NFTs
;; Built with comprehensive error handling and event tracking
;; ============================================================================

;; ----------------------------------------------------------------------------
;; Error Constants
;; ----------------------------------------------------------------------------
(define-constant ERR_NOT_AUTHORIZED (err u401))
(define-constant ERR_INVALID_PRICE (err u402))
(define-constant ERR_LISTING_NOT_FOUND (err u403))
(define-constant ERR_LISTING_INACTIVE (err u404))
(define-constant ERR_INSUFFICIENT_FUNDS (err u405))
(define-constant ERR_TRANSFER_FAILED (err u406))
(define-constant ERR_INVALID_INPUT (err u407))

;; ----------------------------------------------------------------------------
;; Contract Configuration
;; ----------------------------------------------------------------------------
(define-constant CONTRACT_NAME "Market Stall")
(define-constant CONTRACT_VERSION "1.1.0")
(define-constant CONTRACT_DESCRIPTION "Professional NFT marketplace for Festies greeting cards")

;; Listing fee in microSTX (100 microSTX = 0.0001 STX)
(define-data-var listing-fee uint u100)

;; Marketplace owner (can update fees and manage contract)
(define-data-var marketplace-owner principal tx-sender)

;; Total marketplace volume tracking
(define-data-var total-volume uint u0)

;; Total number of successful sales
(define-data-var total-sales uint u0)

;; ----------------------------------------------------------------------------
;; Data Structures
;; ----------------------------------------------------------------------------
(define-map listings
    uint
    {
        seller: principal,
        price: uint,
        active: bool,
        created-at: uint,
        expires-at: uint
    }
)

;; Track sales history
(define-map sales-history
    uint
    {
        seller: principal,
        buyer: principal,
        price: uint,
        sold-at: uint
    }
)

;; ----------------------------------------------------------------------------
;; Events
;; ----------------------------------------------------------------------------
(define-constant EVENT_LISTING_CREATED "listing-created")
(define-constant EVENT_LISTING_CANCELLED "listing-cancelled")
(define-constant EVENT_ITEM_SOLD "item-sold")
(define-constant EVENT_PRICE_UPDATED "price-updated")

;; ----------------------------------------------------------------------------
;; Contract Management Functions
;; ----------------------------------------------------------------------------
(define-public (set-marketplace-owner (new-owner principal))
    (begin
        (asserts! (is-eq tx-sender (var-get marketplace-owner)) ERR_NOT_AUTHORIZED)
        (var-set marketplace-owner new-owner)
        (print {event: "owner-updated", new-owner: new-owner, timestamp: block-height})
        (ok true)
    )
)

(define-public (set-listing-fee (new-fee uint))
    (begin
        (asserts! (is-eq tx-sender (var-get marketplace-owner)) ERR_NOT_AUTHORIZED)
        (var-set listing-fee new-fee)
        (print {event: "fee-updated", new-fee: new-fee, timestamp: block-height})
        (ok true)
    )
)

;; ----------------------------------------------------------------------------
;; Listing Functions
;; ----------------------------------------------------------------------------
(define-public (list-item (item-id uint) (price uint) (duration uint))
    (begin
        ;; Validate inputs
        (asserts! (> price u0) ERR_INVALID_PRICE)
        (asserts! (> duration u0) ERR_INVALID_INPUT)
        (asserts! (<= duration u525600) ERR_INVALID_INPUT) ;; Max 1 year duration
        
        ;; Calculate expiration timestamp
        (let ((expires-at (+ block-height duration)))
            (begin
                ;; Create or update listing
                (map-set listings item-id {
                    seller: tx-sender,
                    price: price,
                    active: true,
                    created-at: block-height,
                    expires-at: expires-at
                })
                
                ;; Emit event
                (print {
                    event: EVENT_LISTING_CREATED,
                    item-id: item-id,
                    seller: tx-sender,
                    price: price,
                    created-at: block-height,
                    expires-at: expires-at
                })
                
                (ok true)
            )
        )
    )
)

(define-public (cancel-listing (item-id uint))
    (let ((listing (map-get? listings item-id)))
        (if (is-some listing)
            (let ((listing-data (unwrap! listing ERR_LISTING_NOT_FOUND)))
                (begin
                    ;; Verify seller
                    (asserts! (is-eq tx-sender (get seller listing-data)) ERR_NOT_AUTHORIZED)
                    
                    ;; Deactivate listing
                    (map-set listings item-id {
                        seller: (get seller listing-data),
                        price: (get price listing-data),
                        active: false,
                        created-at: (get created-at listing-data),
                        expires-at: (get expires-at listing-data)
                    })
                    
                    ;; Emit event
                    (print {
                        event: EVENT_LISTING_CANCELLED,
                        item-id: item-id,
                        seller: tx-sender,
                        timestamp: block-height
                    })
                    
                    (ok true)
                )
            )
            ERR_LISTING_NOT_FOUND
        )
    )
)

(define-public (update-listing-price (item-id uint) (new-price uint))
    (let ((listing (map-get? listings item-id)))
        (if (is-some listing)
            (let ((listing-data (unwrap! listing ERR_LISTING_NOT_FOUND)))
                (begin
                    ;; Verify seller
                    (asserts! (is-eq tx-sender (get seller listing-data)) ERR_NOT_AUTHORIZED)
                    (asserts! (get active listing-data) ERR_LISTING_INACTIVE)
                    (asserts! (> new-price u0) ERR_INVALID_PRICE)
                    
                    ;; Update price
                    (map-set listings item-id {
                        seller: (get seller listing-data),
                        price: new-price,
                        active: true,
                        created-at: (get created-at listing-data),
                        expires-at: (get expires-at listing-data)
                    })
                    
                    ;; Emit event
                    (print {
                        event: EVENT_PRICE_UPDATED,
                        item-id: item-id,
                        new-price: new-price,
                        timestamp: block-height
                    })
                    
                    (ok true)
                )
            )
            ERR_LISTING_NOT_FOUND
        )
    )
)

;; ----------------------------------------------------------------------------
;; Purchase Functions
;; ----------------------------------------------------------------------------
(define-public (purchase-item (item-id uint) (nft-contract principal))
    (let ((listing (map-get? listings item-id)))
        (if (is-some listing)
            (let ((listing-data (unwrap! listing ERR_LISTING_NOT_FOUND)))
                (begin
                    ;; Validate listing
                    (asserts! (get active listing-data) ERR_LISTING_INACTIVE)
                    (asserts! (<= block-height (get expires-at listing-data)) ERR_LISTING_INACTIVE) ;; Check not expired
                    (asserts! (not (is-eq tx-sender (get seller listing-data))) ERR_NOT_AUTHORIZED)
                    
                    (let ((price (get price listing-data))
                          (seller (get seller listing-data)))
                        (begin
                            ;; Transfer STX payment to seller
                            (try! (stx-transfer? price tx-sender seller))
                            
                            ;; Transfer NFT from seller to buyer
                            ;; Note: This requires the NFT contract to be called separately
                            ;; or integrated via a trait call
                            
                            ;; Record sale
                            (map-set sales-history item-id {
                                seller: seller,
                                buyer: tx-sender,
                                price: price,
                                sold-at: block-height
                            })
                            
                            ;; Deactivate listing
                            (map-set listings item-id {
                                seller: seller,
                                price: price,
                                active: false,
                                created-at: (get created-at listing-data),
                                expires-at: (get expires-at listing-data)
                            })
                            
                            ;; Update marketplace statistics
                            (var-set total-volume (+ (var-get total-volume) price))
                            (var-set total-sales (+ (var-get total-sales) u1))
                            
                            ;; Emit event
                            (print {
                                event: EVENT_ITEM_SOLD,
                                item-id: item-id,
                                seller: seller,
                                buyer: tx-sender,
                                price: price,
                                timestamp: block-height
                            })
                            
                            (ok true)
                        )
                    )
                )
            )
            ERR_LISTING_NOT_FOUND
        )
    )
)

;; ----------------------------------------------------------------------------
;; Read-Only Functions
;; ----------------------------------------------------------------------------
(define-read-only (get-listing (item-id uint))
    (ok (map-get? listings item-id))
)

(define-read-only (get-sale-history (item-id uint))
    (ok (map-get? sales-history item-id))
)

(define-read-only (get-marketplace-stats)
    (ok (tuple
        (total-volume (var-get total-volume))
        (total-sales (var-get total-sales))
        (listing-fee (var-get listing-fee))
        (owner (var-get marketplace-owner))
    ))
)

(define-read-only (get-listing-fee)
    (ok (var-get listing-fee))
)

(define-read-only (get-marketplace-owner)
    (ok (var-get marketplace-owner))
)

(define-read-only (get-listing-summary (item-id uint))
    (let ((listing (map-get? listings item-id)))
        (if (is-some listing)
            (let ((data (unwrap! listing ERR_LISTING_NOT_FOUND)))
                (ok (some (tuple
                    (price (get price data))
                    (seller (get seller data))
                    (active (get active data))
                    (expires-at (get expires-at data))
                )))
            )
            (ok none)
        )
    )
)

(define-read-only (is-listing-active (item-id uint))
    (let ((listing (map-get? listings item-id)))
        (if (is-some listing)
            (ok (and (get active (unwrap! listing ERR_LISTING_NOT_FOUND)) 
                     (>= (get expires-at (unwrap! listing ERR_LISTING_NOT_FOUND)) block-height)))
            (ok false)
        )
    )
)
