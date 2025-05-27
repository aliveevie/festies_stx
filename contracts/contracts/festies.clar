;; Basic NFT Contract for Festival Greetings

;; Data maps
(define-map token-owner uint principal)
(define-map token-festival uint (string-ascii 100))
(define-map token-sender uint principal)
(define-map token-message uint (string-ascii 500))
(define-map token-image-uri uint (string-ascii 500))

;; Counter for token IDs
(define-data-var next-token-id uint u1)

;; Public functions
(define-public (mint-greeting-card
    (recipient principal)
    (message (string-ascii 500))
    (festival (string-ascii 100))
    (image-uri (string-ascii 500))
)
    (let
        (
            (new-token-id (var-get next-token-id))
        )
        (begin
            ;; Validate inputs
            (asserts! (is-eq recipient tx-sender) (err u1))
            (asserts! (> (len message) u0) (err u2))
            (asserts! (> (len festival) u0) (err u3))
            (asserts! (> (len image-uri) u0) (err u4))

            ;; Mint the token
            (map-set token-owner new-token-id recipient)
            (map-set token-festival new-token-id festival)
            (map-set token-sender new-token-id tx-sender)
            (map-set token-message new-token-id message)
            (map-set token-image-uri new-token-id image-uri)

            ;; Increment token ID
            (var-set next-token-id (+ new-token-id u1))

            (ok new-token-id)
        )
    )
)

;; Read-only functions
(define-read-only (get-owner (token-id uint))
    (ok (map-get? token-owner token-id))
)

(define-read-only (get-greeting-message (token-id uint))
    (ok (map-get? token-message token-id))
)

(define-read-only (get-greeting-festival (token-id uint))
    (ok (map-get? token-festival token-id))
)

(define-read-only (get-greeting-sender (token-id uint))
    (ok (map-get? token-sender token-id))
)

(define-read-only (get-greeting-image (token-id uint))
    (ok (map-get? token-image-uri token-id))
)

(define-read-only (get-last-token-id)
    (ok (var-get next-token-id))
)