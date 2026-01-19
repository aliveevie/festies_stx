;; Market Stall v1.0.0
;; Marketplace contract for Festies NFT trading
;; Enables listing and purchasing of greeting cards

(define-data-var listing-fee uint u100)

(define-map listings
    uint
    {
        seller: principal,
        price: uint,
        active: bool
    }
)

(define-public (list-item (item-id uint) (price uint))
    (begin
        (map-set listings item-id {
            seller: tx-sender,
            price: price,
            active: true
        })
        (ok true)
    )
)

(define-read-only (get-listing (item-id uint))
    (ok (map-get? listings item-id))
)
// Market v1.0.1
// Market v1.0.2
