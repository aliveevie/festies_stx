;; Enhanced Festival Greetings NFT Contract
;; Professional NFT implementation with comprehensive features and standards
;; Updated for Clarity 4 compatibility
(impl-trait .nft-trait.nft-trait)

;; Contract metadata and configuration
(define-constant CONTRACT_NAME "Festival Greetings")
(define-constant CONTRACT_SYMBOL "FESTIE")
(define-constant CONTRACT_VERSION "2.1.0")
(define-constant CONTRACT_DESCRIPTION "Professional NFT contract for festival greetings with royalty support and advanced features - Updated for Clarity 4")

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
(define-constant ERR_INVALID_TIMESTAMP (err u108))
(define-constant ERR_CONTRACT_NOT_FOUND (err u109))

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

;; Owner statistics tracking
(define-map owner-token-count principal uint)

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
        (print {event: "owner-update", new-owner: new-owner, old-owner: tx-sender, timestamp: stacks-block-time, new-owner-ascii: (to-ascii? new-owner)})
        (ok true)
    )
)

(define-public (pause-contract)
    (begin
        (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_OWNER_ONLY)
        (var-set is-paused true)
        (print {event: EVENT_PAUSE_UPDATE, paused: true, by: tx-sender, timestamp: stacks-block-time, owner-ascii: (to-ascii? tx-sender)})
        (ok true)
    )
)

(define-public (unpause-contract)
    (begin
        (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_OWNER_ONLY)
        (var-set is-paused false)
        (print {event: EVENT_PAUSE_UPDATE, paused: false, by: tx-sender, timestamp: stacks-block-time, owner-ascii: (to-ascii? tx-sender)})
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
        (print {event: EVENT_ROYALTY_UPDATE, recipient: recipient, percentage: percentage, timestamp: stacks-block-time, recipient-ascii: (to-ascii? recipient)})
        (ok true)
    )
)

;; Calculate royalty with detailed breakdown
(define-read-only (calculate-royalty-detailed (sale-price uint))
    (let (
        (percentage (var-get royalty-percentage))
        (royalty-amount (/ (* sale-price percentage) u100))
        (remaining-amount (- sale-price royalty-amount))
    )
        (ok (tuple 
            (sale-price sale-price)
            (royalty-percentage percentage)
            (royalty-amount royalty-amount)
            (remaining-amount remaining-amount)
            (recipient (var-get royalty-recipient))
        ))
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

;; --- Operator Approval System (set-approval-for-all) ---

(define-public (set-approval-for-all (operator principal) (approved bool))
    (begin
        (asserts! (not (var-get is-paused)) ERR_NOT_AUTHORIZED)
        (map-set operator-approvals (tuple (owner tx-sender) (operator operator)) approved)
        (print {event: "operator-approval", owner: tx-sender, operator: operator, approved: approved, timestamp: stacks-block-time})
        (ok true)
    )
)

(define-read-only (is-approval-for-all (owner principal) (operator principal))
    (ok (default-to false (map-get? operator-approvals (tuple (owner owner) (operator operator)))))
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
                        (print {event: EVENT_APPROVAL, token-id: token-id, owner: actual-owner, operator: operator, timestamp: stacks-block-time, owner-ascii: (to-ascii? actual-owner), operator-ascii: (to-ascii? operator)})
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
                        (print {event: EVENT_APPROVAL, token-id: token-id, owner: actual-owner, operator: none, timestamp: stacks-block-time, owner-ascii: (to-ascii? actual-owner)})
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
;; Clarity 4: Enhanced with stacks-block-time for event timestamps

(define-public (transfer (token-id uint) (sender principal) (recipient principal))
    (begin
        (asserts! (not (var-get is-paused)) ERR_NOT_AUTHORIZED)
        (let (
            (approved-operator (map-get? token-approvals token-id))
            (operator-approved (default-to false (map-get? operator-approvals (tuple (owner sender) (operator tx-sender)))))
        )
            (asserts!
                (or 
                    (is-eq tx-sender sender)
                    (and (is-some approved-operator) (is-eq tx-sender (unwrap! approved-operator ERR_NOT_TOKEN_OWNER)))
                    operator-approved
                )
                ERR_NOT_TOKEN_OWNER)
            (let (
                (ignore1 (map-delete token-approvals token-id))
            )
                (begin
                    (try! (nft-transfer? GreetingCard token-id sender recipient))
                    ;; Clarity 4: Include block timestamp in transfer events with ASCII conversion
                    (print {event: EVENT_TRANSFER, token-id: token-id, from: sender, to: recipient, operator: tx-sender, timestamp: stacks-block-time, from-ascii: (to-ascii? sender), to-ascii: (to-ascii? recipient)})
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
                (current-block-time stacks-block-time)
                (nft-data (tuple 
                    (name name)
                    (festival festival)
                    (message message)
                    (image-uri image-uri)
                    (metadata-uri metadata-uri)
                    (sender tx-sender)
                    (recipient recipient)
                    (created-at current-block-time)
                ))
            )
            (begin
                ;; Enhanced input validation with length checks
                (asserts! (> (len name) u0) ERR_INVALID_INPUT)
                (asserts! (<= (len name) u40) ERR_INVALID_INPUT)
                (asserts! (> (len message) u0) ERR_INVALID_INPUT)
                (asserts! (<= (len message) u500) ERR_INVALID_INPUT)
                (asserts! (> (len festival) u0) ERR_INVALID_INPUT)
                (asserts! (<= (len festival) u100) ERR_INVALID_INPUT)
                (asserts! (> (len image-uri) u0) ERR_INVALID_INPUT)
                (asserts! (<= (len image-uri) u500) ERR_INVALID_INPUT)
                (asserts! (> (len metadata-uri) u0) ERR_INVALID_INPUT)
                (asserts! (<= (len metadata-uri) u500) ERR_INVALID_INPUT)
                
                ;; Mint the NFT to the recipient
                (try! (nft-mint? GreetingCard new-token-id recipient))
                (map-set greeting-data new-token-id nft-data)
                
                ;; Update counters and owner statistics
                (var-set next-token-id (+ new-token-id u1))
                (var-set total-supply (+ (var-get total-supply) u1))
                (let ((current-count (default-to u0 (map-get? owner-token-count recipient))))
                    (map-set owner-token-count recipient (+ current-count u1))
                )
                
                ;; Emit event with Clarity 4 features
                (print {event: EVENT_MINT, token-id: new-token-id, to: recipient, from: tx-sender, created-at: current-block-time, recipient-ascii: (to-ascii? recipient), sender-ascii: (to-ascii? tx-sender)})
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
                        
                        ;; Update total supply and owner statistics
                        (var-set total-supply (- (var-get total-supply) u1))
                        (let ((current-count (default-to u0 (map-get? owner-token-count actual-owner))))
                            (if (> current-count u0)
                                (map-set owner-token-count actual-owner (- current-count u1))
                                (map-delete owner-token-count actual-owner)
                            )
                        )
                        
                        (print {event: EVENT_BURN, token-id: token-id, owner: actual-owner, timestamp: stacks-block-time, owner-ascii: (to-ascii? actual-owner), burned-at: stacks-block-time})
                        (ok true)
                    )
                )
                (err ERR_TOKEN_NOT_FOUND)
            )
        )
    )
)

;; --- Owner Statistics Functions ---

(define-read-only (get-owner-statistics (owner principal))
    (ok (tuple 
        (owner owner)
        (token-count (default-to u0 (map-get? owner-token-count owner)))
        (owner-ascii (to-ascii? owner))
    ))
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

;; --- Enhanced Metadata Query Functions ---

;; Check if a specific token is owned by an address
(define-read-only (is-token-owned-by (token-id uint) (owner principal))
    (let ((token-owner (nft-get-owner? GreetingCard token-id)))
        (if (is-some token-owner)
            (ok (is-eq (unwrap! token-owner ERR_TOKEN_NOT_FOUND) owner))
            (ok false)
        )
    )
)

;; Get token count for a specific owner (from statistics)
(define-read-only (get-owner-token-count (owner principal))
    (ok (default-to u0 (map-get? owner-token-count owner)))
)

;; Check if token has specific festival name
(define-read-only (is-token-festival (token-id uint) (festival-name (string-ascii 100)))
    (let ((data (map-get? greeting-data token-id)))
        (if (is-some data)
            (ok (is-eq (get festival (unwrap! data ERR_TOKEN_NOT_FOUND)) festival-name))
            (ok false)
        )
    )
)

;; Get festival name for a token
(define-read-only (get-token-festival (token-id uint))
    (let ((data (map-get? greeting-data token-id)))
        (if (is-some data)
            (ok (some (get festival (unwrap! data ERR_TOKEN_NOT_FOUND))))
            (ok none)
        )
    )
)

;; --- Clarity 4 Utility Functions ---

;; Get current block timestamp (Clarity 4 feature)
(define-read-only (get-current-block-time)
    (ok stacks-block-time)
)

;; Convert principal to ASCII string (Clarity 4 feature)
(define-read-only (principal-to-ascii (addr principal))
    (ok (to-ascii? addr))
)

;; Convert boolean to ASCII string (Clarity 4 feature)
(define-read-only (bool-to-ascii (value bool))
    (ok (to-ascii? value))
)

;; Get formatted address string for display
(define-read-only (get-formatted-address (addr principal))
    (ok (to-ascii? addr))
)

;; Verify contract hash for template verification (Clarity 4 feature)
;; Useful for verifying that another contract follows a specific template
(define-read-only (verify-contract-hash (contract-principal principal) (expected-hash (buff 32)))
    (let ((contract-hash (contract-hash? contract-principal)))
        (if (is-some contract-hash)
            (ok (is-eq (unwrap! contract-hash ERR_INVALID_INPUT) expected-hash))
            (err ERR_CONTRACT_NOT_FOUND)
        )
    )
)

;; Get contract hash for a given principal (Clarity 4 feature)
(define-read-only (get-contract-hash (contract-principal principal))
    (let ((contract-hash (contract-hash? contract-principal)))
        (if (is-some contract-hash)
            (ok (some (unwrap! contract-hash ERR_CONTRACT_NOT_FOUND)))
            (ok none)
        )
    )
)

;; Check if a contract exists and is verified
(define-read-only (is-contract-verified (contract-principal principal) (expected-hash (buff 32)))
    (let ((contract-hash (contract-hash? contract-principal)))
        (if (is-some contract-hash)
            (ok (is-eq (unwrap! contract-hash ERR_CONTRACT_NOT_FOUND) expected-hash))
            (ok false)
        )
    )
)

;; --- Time-based Utility Functions (Clarity 4) ---

;; Get token age in seconds since creation
(define-read-only (get-token-age (token-id uint))
    (let ((data (map-get? greeting-data token-id)))
        (if (is-some data)
            (ok (- stacks-block-time (get created-at (unwrap! data ERR_TOKEN_NOT_FOUND))))
            (err ERR_TOKEN_NOT_FOUND)
        )
    )
)

;; Check if token was created after a specific timestamp
(define-read-only (is-token-created-after (token-id uint) (timestamp uint))
    (let ((data (map-get? greeting-data token-id)))
        (if (is-some data)
            (ok (> (get created-at (unwrap! data ERR_TOKEN_NOT_FOUND)) timestamp))
            (err ERR_TOKEN_NOT_FOUND)
        )
    )
)

;; Check if token was created before a specific timestamp
(define-read-only (is-token-created-before (token-id uint) (timestamp uint))
    (let ((data (map-get? greeting-data token-id)))
        (if (is-some data)
            (ok (< (get created-at (unwrap! data ERR_TOKEN_NOT_FOUND)) timestamp))
            (err ERR_TOKEN_NOT_FOUND)
        )
    )
)

;; Validate timestamp is not in the future
(define-read-only (is-valid-timestamp (timestamp uint))
    (ok (<= timestamp stacks-block-time))
)

;; Check if token was created in a time range
(define-read-only (is-token-in-time-range (token-id uint) (start-time uint) (end-time uint))
    (let ((data (map-get? greeting-data token-id)))
        (if (is-some data)
            (let ((created-at (get created-at (unwrap! data ERR_TOKEN_NOT_FOUND))))
                (ok (and (>= created-at start-time) (<= created-at end-time)))
            )
            (ok false)
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
        (current-block-time stacks-block-time)
        (owner-ascii (to-ascii? (var-get contract-owner)))
        (royalty-recipient-ascii (to-ascii? (var-get royalty-recipient)))
    ))
)

;; Get comprehensive contract information with Clarity 4 features
(define-read-only (get-contract-info-detailed)
    (ok (tuple 
        (name CONTRACT_NAME)
        (symbol CONTRACT_SYMBOL)
        (version CONTRACT_VERSION)
        (description CONTRACT_DESCRIPTION)
        (total-supply (var-get total-supply))
        (next-token-id (var-get next-token-id))
        (current-block-time stacks-block-time)
        (is-paused (var-get is-paused))
        (clarity-version "4.0")
    ))
)

;; --- Batch Transfer Operations ---

(define-public (batch-transfer (token-ids (list uint)) (sender principal) (recipient principal))
    (begin
        (asserts! (not (var-get is-paused)) ERR_NOT_AUTHORIZED)
        (asserts! (> (len token-ids) u0) ERR_INVALID_INPUT)
        (fold transfer-single-token token-ids (tuple (sender sender) (recipient recipient)))
    )
)

(define-private (transfer-single-token (acc (tuple (sender principal) (recipient principal))) (token-id uint))
    (let ((owner (nft-get-owner? GreetingCard token-id)))
        (if (is-some owner)
            (let ((actual-owner (unwrap! owner ERR_NOT_TOKEN_OWNER)))
                (begin
                    (asserts! (is-eq tx-sender actual-owner) ERR_NOT_TOKEN_OWNER)
                    (try! (nft-transfer? GreetingCard token-id actual-owner (get recipient acc)))
                    (map-delete token-approvals token-id)
                    (print {event: EVENT_TRANSFER, token-id: token-id, from: actual-owner, to: (get recipient acc), timestamp: stacks-block-time})
                    acc
                )
            )
            acc
        )
    )
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