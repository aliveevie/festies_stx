;; Basic NFT Contract for Festival Greetings

;; Data maps
(define-map token-owner uint principal)
(define-map token-festival uint (string-ascii 100))
(define-map token-sender uint principal)
(define-map token-message uint (string-ascii 500))
(define-map token-image-uri uint (string-ascii 500))
(define-map token-image-type uint uint)
(define-map sent-tokens principal (list 100 uint))
(define-map received-tokens principal (list 100 uint))

;; Counter for token IDs
(define-data-var next-token-id uint u1)

;; ;; Events
(define-event GreetingCardMinted
    {
        token-id: uint,
        sender: principal,
        recipient: principal,
        festival: (string-ascii 100),
        message: (string-ascii 500)
    }
)

;; Helper functions
(define-private (generate-default-svg (message (string-ascii 500)) (festival (string-ascii 100)))
    (concat
        "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"500\" height=\"500\" viewBox=\"0 0 500 500\">"
        "<rect width=\"500\" height=\"500\" fill=\"#f0f0f0\"/>"
        "<text x=\"50%\" y=\"40%\" dominant-baseline=\"middle\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"24\" fill=\"#333\">"
        festival
        "</text>"
        "<text x=\"50%\" y=\"50%\" dominant-baseline=\"middle\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#666\">"
        message
        "</text>"
        "</svg>"
    )
)

(define-private (generate-metadata
    (message (string-ascii 500))
    (festival (string-ascii 100))
    (image-uri (string-ascii 500))
    (image-type uint)
)
    (let
        (
            (image-data
                (if (is-eq image-type u0)
                    image-uri
                    (concat "data:image/svg+xml;base64," (base64-encode (generate-default-svg message festival)))
                )
            )
        )
        (concat
            "data:application/json;base64,"
            (base64-encode
                (concat
                    "{\"name\": \"Festival Greeting\","
                    "\"description\": \"A special festival greeting NFT\","
                    "\"attributes\": [{\"trait_type\": \"Festival\", \"value\": \""
                    festival
                    "\"}],"
                    "\"image\": \""
                    image-data
                    "\"}"
                )
            )
        )
    )
)

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

            ;; Emit event
            (emit-event GreetingCardMinted
                new-token-id
                tx-sender
                recipient
                festival
                message
            )

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

(define-read-only (get-sent-greetings (sender principal))
    (ok (map-get? sent-tokens sender))
)

(define-read-only (get-received-greetings (recipient principal))
    (ok (map-get? received-tokens recipient))
)

(define-read-only (get-last-token-id)
    (ok (var-get next-token-id))
)

;; NFT trait implementation
(define-read-only (get-token-uri (token-id uint))
    (let
        (
            (message (unwrap! (map-get? token-message token-id) (err u1)))
            (festival (unwrap! (map-get? token-festival token-id) (err u2)))
            (image-uri (unwrap! (map-get? token-image-uri token-id) (err u3)))
            (image-type (unwrap! (map-get? token-image-type token-id) (err u4)))
        )
        (ok (generate-metadata message festival image-uri image-type))
    )
)