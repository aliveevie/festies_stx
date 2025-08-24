;; Enhanced Festival Greetings NFT Contract
;; Professional NFT implementation with comprehensive features and standards
(impl-trait .nft-trait.nft-trait)

;; Contract metadata and configuration
(define-constant CONTRACT_NAME "Festival Greetings")
(define-constant CONTRACT_SYMBOL "FESTIE")
(define-constant CONTRACT_VERSION "2.0.0")
(define-constant CONTRACT_DESCRIPTION "Professional NFT contract for festival greetings with royalty support and advanced features")

;; Define the NFT type
(define-non-fungible-token GreetingCard uint)

;; Enhanced error constants with descriptive codes
(define-constant ERR_OWNER_ONLY (err u100))
(define-constant ERR_NOT_TOKEN_OWNER (err u101))
(define-constant ERR_INVALID_INPUT (err u102))
(define-constant ERR_NOT_AUTHORIZED (err u103))
(define-constant ERR_TOKEN_NOT_FOUND (err u104))
(define-constant ERR_INVALID_ROYALTY (err u105))
(define-constant ERR_TRANSFER_FAILED (err u106))
(define-constant ERR_APPROVAL_FAILED (err u107))

;; Contract state variables
(define-data-var contract-owner principal tx-sender)
(define-data-var next-token-id uint u1)
(define-data-var total-supply uint u0)
(define-data-var is-paused bool false)

;; Royalty configuration
(define-data-var royalty-percentage uint u5) ;; 5% default
(define-data-var royalty-recipient principal tx-sender)

;; Enhanced data structure with creation timestamp
(define-map greeting-data uint (tuple 
    (name (string-ascii 40))
    (festival (string-ascii 100))
    (message (string-ascii 500))
    (image-uri (string-ascii 500))
    (metadata-uri (string-ascii 500))
    (sender principal)
    (recipient principal)
    (created-at uint)
))

;; Approval system
(define-map token-approvals uint principal)
(define-map operator-approvals (tuple (owner principal) (operator principal)) bool)

;; Events for better tracking
(define-constant EVENT_MINT "mint")
(define-constant EVENT_TRANSFER "transfer")
(define-constant EVENT_BURN "burn")
(define-constant EVENT_APPROVAL "approval")
(define-constant EVENT_ROYALTY_UPDATE "royalty-update")
(define-constant EVENT_PAUSE_UPDATE "pause-update")

;; --- Contract Management Functions ---

(define-public (set-contract-owner (new-owner principal))
    (begin
        (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_OWNER_ONLY)
        (var-set contract-owner new-owner)
        (print {event: "owner-update", new-owner: new-owner})
        (ok true)
    )
)

(define-public (pause-contract)
    (begin
        (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_OWNER_ONLY)
        (var-set is-paused true)
        (print {event: EVENT_PAUSE_UPDATE, paused: true, by: tx-sender})
        (ok true)
    )
)

(define-public (unpause-contract)
    (begin
        (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_OWNER_ONLY)
        (var-set is-paused false)
        (print {event: EVENT_PAUSE_UPDATE, paused: false, by: tx-sender})
        (ok true)
    )
)

;; --- Royalty Management ---

(define-public (set-royalty-info (recipient principal) (percentage uint))
    (begin
        (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_OWNER_ONLY)
        (asserts! (<= percentage u100) ERR_INVALID_ROYALTY)
        (var-set royalty-recipient recipient)
        (var-set royalty-percentage percentage)
        (print {event: EVENT_ROYALTY_UPDATE, recipient: recipient, percentage: percentage})
        (ok true)
    )
)

;; --- Required Trait Implementation ---

(define-read-only (get-total-supply)
    (ok (var-get total-supply))
)

(define-read-only (get-last-token-id)
    (ok (var-get next-token-id))
)

(define-read-only (get-token-uri (token-id uint))
    (let ((data (map-get? greeting-data token-id)))
        (if (is-some data)
            (ok (some (get metadata-uri (unwrap! data ERR_INVALID_INPUT))))
            (ok none)
        )
    )
)

(define-read-only (get-owner (token-id uint))
    (ok (nft-get-owner? GreetingCard token-id))
)

(define-read-only (get-token-metadata (token-id uint))
    (let ((data (map-get? greeting-data token-id)))
        (if (is-some data)
            (ok (some data))
            (err ERR_TOKEN_NOT_FOUND)
        )
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

(define-read-only (get-contract-owner)
    (ok (var-get contract-owner))
)

(define-read-only (get-contract-info)
    (ok (tuple 
        (name CONTRACT_NAME)
        (symbol CONTRACT_SYMBOL)
        (version CONTRACT_VERSION)
        (description CONTRACT_DESCRIPTION)
    ))
)

;; --- Approval System Implementation ---

(define-public (approve (token-id uint) (operator principal))
    (begin
        (asserts! (not (var-get is-paused)) ERR_NOT_AUTHORIZED)
        (let ((owner (nft-get-owner? GreetingCard token-id)))
            (if (is-some owner)
                (let ((actual-owner (unwrap! owner ERR_NOT_TOKEN_OWNER)))
                    (begin
                        (asserts! (is-eq tx-sender actual-owner) ERR_NOT_TOKEN_OWNER)
                        (map-set token-approvals token-id operator)
                        (print {event: EVENT_APPROVAL, token-id: token-id, owner: actual-owner, operator: operator})
                        (ok true)
                    )
                )
                (begin
                    (err ERR_TOKEN_NOT_FOUND)
                )
            )
        )
    )
)

(define-public (revoke-approval (token-id uint))
    (begin
        (asserts! (not (var-get is-paused)) ERR_NOT_AUTHORIZED)
        (let ((owner (nft-get-owner? GreetingCard token-id)))
            (if (is-some owner)
                (let ((actual-owner (unwrap! owner ERR_NOT_TOKEN_OWNER)))
                    (begin
                        (asserts! (is-eq tx-sender actual-owner) ERR_NOT_TOKEN_OWNER)
                        (map-delete token-approvals token-id)
                        (print {event: EVENT_APPROVAL, token-id: token-id, owner: actual-owner, operator: none})
                        (ok true)
                    )
                )
                (err ERR_TOKEN_NOT_FOUND)
            )
        )
    )
)

(define-read-only (get-approved (token-id uint))
    (ok (map-get? token-approvals token-id))
)

;; --- Enhanced Transfer Function ---

(define-public (transfer (token-id uint) (sender principal) (recipient principal))
    (begin
        (asserts! (not (var-get is-paused)) ERR_NOT_AUTHORIZED)
        (let ((approved-operator (map-get? token-approvals token-id)))
            (asserts!
                (or (is-eq tx-sender sender)
                    (and (is-some approved-operator) (is-eq tx-sender (unwrap! approved-operator ERR_NOT_TOKEN_OWNER))))
                ERR_NOT_TOKEN_OWNER)
            (let (
                (ignore1 (map-delete token-approvals token-id))
            )
                (begin
                    (try! (nft-transfer? GreetingCard token-id sender recipient))
                    (print {event: EVENT_TRANSFER, token-id: token-id, from: sender, to: recipient, operator: tx-sender})
                    (ok true)
                )
            )
        )
    )
)

;; --- Enhanced Minting Function ---

(define-public (mint-greeting-card
    (recipient principal)
    (name (string-ascii 40))
    (message (string-ascii 500))
    (festival (string-ascii 100))
    (image-uri (string-ascii 500))
    (metadata-uri (string-ascii 500))
)
    (begin
        (asserts! (not (var-get is-paused)) ERR_NOT_AUTHORIZED)
        (let
            (
                (new-token-id (var-get next-token-id))
                (current-block-height (var-get next-token-id))
                (nft-data (tuple 
                    (name name)
                    (festival festival)
                    (message message)
                    (image-uri image-uri)
                    (metadata-uri metadata-uri)
                    (sender tx-sender)
                    (recipient recipient)
                    (created-at current-block-height)
                ))
            )
            (begin
                ;; Enhanced input validation
                (asserts! (> (len name) u0) ERR_INVALID_INPUT)
                (asserts! (> (len message) u0) ERR_INVALID_INPUT)
                (asserts! (> (len festival) u0) ERR_INVALID_INPUT)
                (asserts! (> (len image-uri) u0) ERR_INVALID_INPUT)
                (asserts! (> (len metadata-uri) u0) ERR_INVALID_INPUT)
                
                ;; Mint the NFT to the recipient
                (try! (nft-mint? GreetingCard new-token-id recipient))
                (map-set greeting-data new-token-id nft-data)
                
                ;; Update counters
                (var-set next-token-id (+ new-token-id u1))
                (var-set total-supply (+ (var-get total-supply) u1))
                
                ;; Emit event
                (print {event: EVENT_MINT, token-id: new-token-id, to: recipient, from: tx-sender, created-at: current-block-height})
                (ok new-token-id)
            )
        )
    )
)

;; --- Enhanced Burning Function ---

(define-public (burn-greeting-card (token-id uint))
    (begin
        (asserts! (not (var-get is-paused)) ERR_NOT_AUTHORIZED)
        (let ((owner (nft-get-owner? GreetingCard token-id)))
            (if (is-some owner)
                (let ((actual-owner (unwrap! owner ERR_NOT_TOKEN_OWNER)))
                    (begin
                        (asserts! (is-eq tx-sender actual-owner) ERR_NOT_TOKEN_OWNER)
                        (try! (nft-burn? GreetingCard token-id actual-owner))
                        (map-delete greeting-data token-id)
                        (map-delete token-approvals token-id)
                        
                        ;; Update total supply
                        (var-set total-supply (- (var-get total-supply) u1))
                        
                        (print {event: EVENT_BURN, token-id: token-id, owner: actual-owner})
                        (ok true)
                    )
                )
                (err ERR_TOKEN_NOT_FOUND)
            )
        )
    )
)

;; --- Additional Utility Functions ---

(define-read-only (get-greeting-card (token-id uint))
    (let ((owner (nft-get-owner? GreetingCard token-id)))
        (if (is-some owner)
            (ok (map-get? greeting-data token-id))
            (err ERR_TOKEN_NOT_FOUND)
        )
    )
)

(define-read-only (get-contract-status)
    (ok (tuple 
        (owner (var-get contract-owner))
        (paused (var-get is-paused))
        (total-supply (var-get total-supply))
        (next-token-id (var-get next-token-id))
        (royalty-percentage (var-get royalty-percentage))
        (royalty-recipient (var-get royalty-recipient))
    ))
)

;; --- Batch Operations for Efficiency ---

(define-public (batch-mint-greeting-cards
    (recipients (list principal))
    (names (list (string-ascii 40)))
    (messages (list (string-ascii 500)))
    (festivals (list (string-ascii 100)))
    (image-uris (list (string-ascii 500)))
    (metadata-uris (list (string-ascii 500)))
)
    (begin
        (asserts! (not (var-get is-paused)) ERR_NOT_AUTHORIZED)
        (asserts! (and 
            (is-eq (len recipients) (len names))
            (is-eq (len recipients) (len messages))
            (is-eq (len recipients) (len festivals))
            (is-eq (len recipients) (len image-uris))
            (is-eq (len recipients) (len metadata-uris))
        ) ERR_INVALID_INPUT)
        
        (fold mint-single-card (list 
            recipients names messages festivals image-uris metadata-uris
        ) (list))
    )
)

(define-private (mint-single-card
    (acc (list uint))
    (recipient principal)
    (name (string-ascii 40))
    (message (string-ascii 500))
    (festival (string-ascii 100))
    (image-uri (string-ascii 500))
    (metadata-uri (string-ascii 500))
)
    (let ((mint-result (mint-greeting-card recipient name message festival image-uri metadata-uri)))
        (if (is-ok mint-result)
            (append acc (list (unwrap! mint-result ERR_INVALID_INPUT)))
            acc
        )
    )
)