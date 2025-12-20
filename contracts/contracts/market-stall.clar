;; Market Stall
;; Simple marketplace for listing items

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
