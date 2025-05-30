;; Basic NFT Contract for Festival Greetings

;; Define the NFT type
(define-non-fungible-token GreetingCard uint)

;; Data map for NFT metadata
(define-map greeting-data uint (tuple 
    (name (string-ascii 40))
    (festival (string-ascii 100))
    (message (string-ascii 500))
    (image-uri (string-ascii 500))
    (sender principal)
))

;; Counter for token IDs
(define-data-var next-token-id uint u1)

;; Public functions
(define-public (mint-greeting-card
    (name (string-ascii 40))
    (message (string-ascii 500))
    (festival (string-ascii 100))
    (image-uri (string-ascii 500))
)
    (let
        (
            (new-token-id (var-get next-token-id))
            (nft-data (tuple 
                (name name)
                (festival festival)
                (message message)
                (image-uri image-uri)
                (sender tx-sender)
            ))
        )
        (begin
            ;; Validate inputs
            (asserts! (> (len name) u0) (err u1))
            (asserts! (> (len message) u0) (err u2))
            (asserts! (> (len festival) u0) (err u3))
            (asserts! (> (len image-uri) u0) (err u4))

            ;; Mint the NFT
            (try! (nft-mint? GreetingCard new-token-id tx-sender))

            ;; Store the metadata
            (map-set greeting-data new-token-id nft-data)

            ;; Increment token ID
            (var-set next-token-id (+ new-token-id u1))

            (ok new-token-id)
        )
    )
)

;; Read-only functions
(define-read-only (get-greeting-card (token-id uint))
    (let ((owner (nft-get-owner? GreetingCard token-id)))
        (if (is-some owner)
            (ok (map-get? greeting-data token-id))
            (err u404)
        )
    )
)

(define-read-only (get-last-token-id)
    (ok (var-get next-token-id))
)