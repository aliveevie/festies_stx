;; ============================================================================
;; NFT Factory Contract v1.0.0
;; ============================================================================
;; Factory contract for creating and managing NFT collections
;; Enables batch minting and collection management
;; ============================================================================

(define-constant CONTRACT_NAME "NFT Factory")
(define-constant CONTRACT_VERSION "1.0.0")
(define-constant CONTRACT_DESCRIPTION "Factory for creating and managing NFT collections")

;; ----------------------------------------------------------------------------
;; Error Constants
;; ----------------------------------------------------------------------------
(define-constant ERR_NOT_AUTHORIZED (err u401))
(define-constant ERR_INVALID_INPUT (err u402))
(define-constant ERR_COLLECTION_NOT_FOUND (err u403))
(define-constant ERR_COLLECTION_EXISTS (err u404))

;; ----------------------------------------------------------------------------
;; Contract State
;; ----------------------------------------------------------------------------
(define-data-var factory-owner principal tx-sender)
(define-data-var collection-count uint u0)

;; Collection registry
(define-map collections uint (tuple
    (name (string-ascii 50))
    (symbol (string-ascii 10))
    (contract-address principal)
    (creator principal)
    (created-at uint)
    (total-supply uint)
    (active bool)
))

;; Creator's collections
(define-map creator-collections principal (list 100 uint))

;; ----------------------------------------------------------------------------
;; Contract Management
;; ----------------------------------------------------------------------------
(define-public (set-factory-owner (new-owner principal))
    (begin
        (asserts! (is-eq tx-sender (var-get factory-owner)) ERR_NOT_AUTHORIZED)
        (var-set factory-owner new-owner)
        (print {event: "owner-updated", new-owner: new-owner, timestamp: block-height})
        (ok true)
    )
)

;; ----------------------------------------------------------------------------
;; Collection Management
;; ----------------------------------------------------------------------------
(define-public (register-collection 
    (name (string-ascii 50))
    (symbol (string-ascii 10))
    (contract-address principal)
)
    (begin
        (asserts! (> (len name) u0) ERR_INVALID_INPUT)
        (asserts! (<= (len name) u50) ERR_INVALID_INPUT)
        (asserts! (> (len symbol) u0) ERR_INVALID_INPUT)
        (asserts! (<= (len symbol) u10) ERR_INVALID_INPUT)
        
        (let ((collection-id (var-get collection-count)))
            (begin
                ;; Register collection
                (map-set collections collection-id (tuple
                    (name name)
                    (symbol symbol)
                    (contract-address contract-address)
                    (creator tx-sender)
                    (created-at block-height)
                    (total-supply u0)
                    (active true)
                ))
                
                ;; Add to creator's collections
                (let ((creator-collections-list (default-to (list) (map-get? creator-collections tx-sender))))
                    (map-set creator-collections tx-sender (unwrap-panic (as-max-len? (append creator-collections-list collection-id) u100)))
                )
                
                ;; Increment counter
                (var-set collection-count (+ collection-id u1))
                
                ;; Emit event
                (print {
                    event: "collection-registered",
                    collection-id: collection-id,
                    name: name,
                    symbol: symbol,
                    contract: contract-address,
                    creator: tx-sender,
                    timestamp: block-height
                })
                
                (ok collection-id)
            )
        )
    )
)

(define-public (update-collection-status (collection-id uint) (active bool))
    (let ((collection (map-get? collections collection-id)))
        (if (is-some collection)
            (let ((collection-data (unwrap! collection ERR_COLLECTION_NOT_FOUND)))
                (begin
                    (asserts! 
                        (or 
                            (is-eq tx-sender (get creator collection-data))
                            (is-eq tx-sender (var-get factory-owner))
                        )
                        ERR_NOT_AUTHORIZED
                    )
                    
                    (map-set collections collection-id (tuple
                        (name (get name collection-data))
                        (symbol (get symbol collection-data))
                        (contract-address (get contract-address collection-data))
                        (creator (get creator collection-data))
                        (created-at (get created-at collection-data))
                        (total-supply (get total-supply collection-data))
                        (active active)
                    ))
                    
                    (print {
                        event: "collection-status-updated",
                        collection-id: collection-id,
                        active: active,
                        timestamp: block-height
                    })
                    
                    (ok true)
                )
            )
            (err ERR_COLLECTION_NOT_FOUND)
        )
    )
)

;; ----------------------------------------------------------------------------
;; Read-Only Functions
;; ----------------------------------------------------------------------------
(define-read-only (get-collection (collection-id uint))
    (ok (map-get? collections collection-id))
)

(define-read-only (get-creator-collections (creator principal))
    (ok (map-get? creator-collections creator))
)

(define-read-only (get-collection-count)
    (ok (var-get collection-count))
)

(define-read-only (get-factory-info)
    (ok (tuple
        (name CONTRACT_NAME)
        (version CONTRACT_VERSION)
        (description CONTRACT_DESCRIPTION)
        (owner (var-get factory-owner))
        (total-collections (var-get collection-count))
    ))
)
// Refactor improvement
// Documentation update
