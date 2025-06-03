;; Basic NFT Contract for Festival Greetings
(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

;; Define the NFT type
(define-non-fungible-token GreetingCard uint)

;; Constants for error handling
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-invalid-input (err u102))

;; Data map for NFT metadata
(define-map greeting-data uint (tuple 
    (name (string-ascii 40))
    (festival (string-ascii 100))
    (message (string-ascii 500))
    (image-uri (string-ascii 500))
    (sender principal)
    (recipient principal)
))

;; Counter for token IDs
(define-data-var next-token-id uint u1)

;; Required trait functions
(define-read-only (get-last-token-id)
    (ok (var-get next-token-id))
)

(define-read-only (get-token-uri (token-id uint))
    (ok (map-get? greeting-data token-id))
)

(define-read-only (get-owner (token-id uint))
    (ok (nft-get-owner? GreetingCard token-id))
)

(define-public (transfer (token-id uint) (sender principal) (recipient principal))
    (begin
        (asserts! (is-eq tx-sender sender) err-not-token-owner)
        ;; #[filter(token-id, recipient)]
        (nft-transfer? GreetingCard token-id sender recipient)
    )
)

;; Public functions
(define-public (mint-greeting-card
    (recipient principal)
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
                (recipient recipient)
            ))
        )
        (begin
            ;; Validate inputs
            (asserts! (> (len name) u0) err-invalid-input)
            (asserts! (> (len message) u0) err-invalid-input)
            (asserts! (> (len festival) u0) err-invalid-input)
            (asserts! (> (len image-uri) u0) err-invalid-input)
            ;; #[filter(recipient, name, message, festival, image-uri)]

            ;; Mint the NFT to the recipient
            (try! (nft-mint? GreetingCard new-token-id recipient))

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