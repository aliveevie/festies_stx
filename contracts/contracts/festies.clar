;; Basic NFT Contract for Festival Greetings
(impl-trait .nft-trait.nft-trait)

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
    (metadata-uri (string-ascii 500))
    (sender principal)
    (recipient principal)
))

;; Counter for token IDs
(define-data-var next-token-id uint u1)

;; --- Royalty Mechanism ---
(define-data-var royalty-percentage uint u5) ;; 5% default
(define-data-var royalty-recipient principal contract-owner)

(define-constant err-not-owner (err u103))

(define-public (set-royalty-info (recipient principal) (percentage uint))
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-not-owner)
        (asserts! (<= percentage u100) err-invalid-input)
        (var-set royalty-recipient recipient)
        (var-set royalty-percentage percentage)
        (ok true)
    )
)

(define-read-only (get-royalty-info)
    (ok (tuple (recipient (var-get royalty-recipient)) (percentage (var-get royalty-percentage))))
)

(define-read-only (calculate-royalty (sale-price uint))
    (let ((percentage (var-get royalty-percentage)))
        (ok (/ (* sale-price percentage) u100))
    )
)

;; Required trait functions
(define-read-only (get-last-token-id)
    (ok (var-get next-token-id))
)

(define-read-only (get-token-uri (token-id uint))
    (let ((data (map-get? greeting-data token-id)))
        (if (is-some data)
            (ok (some (get metadata-uri (unwrap! data err-invalid-input))))
            (ok none)
        )
    )
)

(define-read-only (get-owner (token-id uint))
    (ok (nft-get-owner? GreetingCard token-id))
)

;; --- Approval/Operator System ---
(define-map token-approvals uint principal)

(define-public (approve (token-id uint) (operator principal))
    (let ((owner (nft-get-owner? GreetingCard token-id)))
        (if (is-some owner)
            (let ((actual-owner (unwrap! owner err-not-token-owner)))
                (begin
                    (asserts! (is-eq tx-sender actual-owner) err-not-token-owner)
                    (map-set token-approvals token-id operator)
                    (ok true)
                )
            )
            (err u404)
        )
    )
)

(define-public (revoke-approval (token-id uint))
    (let ((owner (nft-get-owner? GreetingCard token-id)))
        (if (is-some owner)
            (let ((actual-owner (unwrap! owner err-not-token-owner)))
                (begin
                    (asserts! (is-eq tx-sender actual-owner) err-not-token-owner)
                    (map-delete token-approvals token-id)
                    (ok true)
                )
            )
            (err u404)
        )
    )
)

(define-read-only (get-approved (token-id uint))
    (ok (map-get? token-approvals token-id))
)

;; Update transfer to allow approved operator
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
    (let ((approved-operator (map-get? token-approvals token-id)))
        (begin
            (asserts!
                (or (is-eq tx-sender sender)
                    (and (is-some approved-operator) (is-eq tx-sender (unwrap! approved-operator err-not-token-owner))))
                err-not-token-owner)
            (map-delete token-approvals token-id)
            (nft-transfer? GreetingCard token-id sender recipient)
        )
    )
)

;; Public functions
(define-public (mint-greeting-card
    (recipient principal)
    (name (string-ascii 40))
    (message (string-ascii 500))
    (festival (string-ascii 100))
    (image-uri (string-ascii 500))
    (metadata-uri (string-ascii 500))
)
    (let
        (
            (new-token-id (var-get next-token-id))
            (nft-data (tuple 
                (name name)
                (festival festival)
                (message message)
                (image-uri image-uri)
                (metadata-uri metadata-uri)
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
            (asserts! (> (len metadata-uri) u0) err-invalid-input)
            ;; #[filter(recipient, name, message, festival, image-uri, metadata-uri)]

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

;; --- Burn Functionality ---
(define-public (burn-greeting-card (token-id uint))
    (let ((owner (nft-get-owner? GreetingCard token-id)))
        (if (is-some owner)
            (let ((actual-owner (unwrap! owner err-not-token-owner)))
                (begin
                    (asserts! (is-eq tx-sender actual-owner) err-not-token-owner)
                    (try! (nft-burn? GreetingCard token-id actual-owner))
                    (map-delete greeting-data token-id)
                    (ok true)
                )
            )
            (err u404)
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