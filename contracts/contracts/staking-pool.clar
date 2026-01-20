;; ============================================================================
;; Staking Pool Contract v1.0.0
;; ============================================================================
;; Staking pool for Festies NFTs
;; Allows users to stake their greeting cards and earn rewards
;; ============================================================================

(define-constant CONTRACT_NAME "Staking Pool")
(define-constant CONTRACT_VERSION "1.0.0")
(define-constant CONTRACT_DESCRIPTION "Staking pool for Festies greeting card NFTs")

;; ----------------------------------------------------------------------------
;; Error Constants
;; ----------------------------------------------------------------------------
(define-constant ERR_NOT_AUTHORIZED (err u401))
(define-constant ERR_NOT_STAKED (err u402))
(define-constant ERR_ALREADY_STAKED (err u403))
(define-constant ERR_INVALID_AMOUNT (err u404))
(define-constant ERR_INSUFFICIENT_REWARDS (err u405))

;; ----------------------------------------------------------------------------
;; Contract State
;; ----------------------------------------------------------------------------
(define-data-var pool-owner principal tx-sender)
(define-data-var reward-rate uint u100) ;; Rewards per block (in microSTX)
(define-data-var total-staked uint u0)
(define-data-var total-rewards-distributed uint u0)

;; Staking data per token
(define-map staked-tokens (tuple (token-id uint) (owner principal)) (tuple
    (staked-at uint)
    (last-claim uint)
    (accumulated-rewards uint)
))

;; Owner's staked tokens
(define-map owner-stakes principal (list 100 uint))

;; Reward pool balance
(define-data-var reward-pool uint u0)

;; ----------------------------------------------------------------------------
;; Contract Management
;; ----------------------------------------------------------------------------
(define-public (set-pool-owner (new-owner principal))
    (begin
        (asserts! (is-eq tx-sender (var-get pool-owner)) ERR_NOT_AUTHORIZED)
        (var-set pool-owner new-owner)
        (print {event: "owner-updated", new-owner: new-owner, timestamp: block-height})
        (ok true)
    )
)

(define-public (set-reward-rate (new-rate uint))
    (begin
        (asserts! (is-eq tx-sender (var-get pool-owner)) ERR_NOT_AUTHORIZED)
        (var-set reward-rate new-rate)
        (print {event: "reward-rate-updated", rate: new-rate, timestamp: block-height})
        (ok true)
    )
)

(define-public (deposit-rewards)
    (begin
        (asserts! (> stx-transfer-amount u0) ERR_INVALID_AMOUNT)
        (var-set reward-pool (+ (var-get reward-pool) stx-transfer-amount))
        (print {
            event: "rewards-deposited",
            amount: stx-transfer-amount,
            total-pool: (var-get reward-pool),
            timestamp: block-height
        })
        (ok true)
    )
)

;; ----------------------------------------------------------------------------
;; Staking Functions
;; ----------------------------------------------------------------------------
(define-public (stake-token (token-id uint) (nft-contract principal))
    (let ((stake-key (tuple (token-id token-id) (owner tx-sender))))
        (begin
            (asserts! (is-none (map-get? staked-tokens stake-key)) ERR_ALREADY_STAKED)
            
            ;; Register stake
            (map-set staked-tokens stake-key (tuple
                (staked-at block-height)
                (last-claim block-height)
                (accumulated-rewards u0)
            ))
            
            ;; Add to owner's stakes
            (let ((owner-stakes-list (default-to (list) (map-get? owner-stakes tx-sender))))
                (map-set owner-stakes tx-sender (unwrap-panic (as-max-len? (append owner-stakes-list token-id) u100)))
            )
            
            ;; Update totals
            (var-set total-staked (+ (var-get total-staked) u1))
            
            ;; Emit event
            (print {
                event: "token-staked",
                token-id: token-id,
                owner: tx-sender,
                timestamp: block-height
            })
            
            (ok true)
        )
    )
)

(define-public (unstake-token (token-id uint))
    (let ((stake-key (tuple (token-id token-id) (owner tx-sender))))
        (let ((stake-data (map-get? staked-tokens stake-key)))
            (if (is-some stake-data)
                (let ((data (unwrap! stake-data ERR_NOT_STAKED)))
                    (begin
                        ;; Calculate final rewards
                        (let ((rewards (calculate-rewards token-id tx-sender)))
                            (begin
                                ;; Transfer rewards if any
                                (if (> rewards u0)
                                    (begin
                                        (asserts! (>= (var-get reward-pool) rewards) ERR_INSUFFICIENT_REWARDS)
                                        (try! (stx-transfer? rewards (var-get pool-owner) tx-sender))
                                        (var-set reward-pool (- (var-get reward-pool) rewards))
                                        (var-set total-rewards-distributed (+ (var-get total-rewards-distributed) rewards))
                                    )
                                    true
                                )
                                
                                ;; Remove stake
                                (map-delete staked-tokens stake-key)
                                (var-set total-staked (- (var-get total-staked) u1))
                                
                                ;; Emit event
                                (print {
                                    event: "token-unstaked",
                                    token-id: token-id,
                                    owner: tx-sender,
                                    rewards-claimed: rewards,
                                    timestamp: block-height
                                })
                                
                                (ok true)
                            )
                        )
                    )
                )
                (err ERR_NOT_STAKED)
            )
        )
    )
)

;; ----------------------------------------------------------------------------
;; Reward Functions
;; ----------------------------------------------------------------------------
(define-read-only (calculate-rewards (token-id uint) (owner principal))
    (let ((stake-key (tuple (token-id token-id) (owner owner))))
        (let ((stake-data (map-get? staked-tokens stake-key)))
            (if (is-some stake-data)
                (let ((data (unwrap! stake-data ERR_NOT_STAKED)))
                    (let (
                        (staked-at (get staked-at data))
                        (last-claim (get last-claim data))
                        (accumulated (get accumulated-rewards data))
                        (blocks-staked (- block-height last-claim))
                        (new-rewards (* blocks-staked (var-get reward-rate)))
                    )
                        (ok (+ accumulated new-rewards))
                    )
                )
                (ok u0)
            )
        )
    )
)

(define-public (claim-rewards (token-id uint))
    (let ((stake-key (tuple (token-id token-id) (owner tx-sender))))
        (let ((stake-data (map-get? staked-tokens stake-key)))
            (if (is-some stake-data)
                (let ((data (unwrap! stake-data ERR_NOT_STAKED)))
                    (let ((rewards (unwrap! (calculate-rewards token-id tx-sender) ERR_NOT_STAKED)))
                        (begin
                            (asserts! (> rewards u0) ERR_INVALID_AMOUNT)
                            (asserts! (>= (var-get reward-pool) rewards) ERR_INSUFFICIENT_REWARDS)
                            
                            ;; Transfer rewards
                            (try! (stx-transfer? rewards (var-get pool-owner) tx-sender))
                            (var-set reward-pool (- (var-get reward-pool) rewards))
                            (var-set total-rewards-distributed (+ (var-get total-rewards-distributed) rewards))
                            
                            ;; Update stake data
                            (map-set staked-tokens stake-key (tuple
                                (staked-at (get staked-at data))
                                (last-claim block-height)
                                (accumulated-rewards u0)
                            ))
                            
                            ;; Emit event
                            (print {
                                event: "rewards-claimed",
                                token-id: token-id,
                                owner: tx-sender,
                                amount: rewards,
                                timestamp: block-height
                            })
                            
                            (ok rewards)
                        )
                    )
                )
                (err ERR_NOT_STAKED)
            )
        )
    )
)

;; ----------------------------------------------------------------------------
;; Read-Only Functions
;; ----------------------------------------------------------------------------
(define-read-only (get-stake-info (token-id uint) (owner principal))
    (ok (map-get? staked-tokens (tuple (token-id token-id) (owner owner))))
)

(define-read-only (get-owner-stakes (owner principal))
    (ok (map-get? owner-stakes owner))
)

(define-read-only (get-pool-stats)
    (ok (tuple
        (total-staked (var-get total-staked))
        (reward-pool (var-get reward-pool))
        (reward-rate (var-get reward-rate))
        (total-rewards-distributed (var-get total-rewards-distributed))
    ))
)
// Refactor improvement
