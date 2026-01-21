;; Multisig Contract for Festies DAO
;; Implements multi-signature wallet functionality for secure governance

(define-constant contract-owner tx-sender)
(define-constant min-threshold u2) ;; Minimum 2 signatures required
(define-constant max-owners u10) ;; Maximum 10 owners

(define-map owners principal bool)

(define-data-var threshold uint min-threshold)
(define-data-var owner-count uint u0)
(define-data-var next-tx-id uint u1)

(define-map transactions
  {tx-id: uint}
  {
    to: principal,
    value: uint,
    data: (buff 1024),
    executed: bool,
    num-confirmations: uint,
    created-at: uint
  }
)

(define-map confirmations
  {tx-id: uint, owner: principal}
  bool
)

;; Add owner
(define-public (add-owner (owner principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) (err u1001))
    (asserts! (not (default-to false (map-get? owners owner))) (err u1002))
    (asserts! (< (var-get owner-count) max-owners) (err u1003))
    
    (map-set owners owner true)
    (var-set owner-count (+ (var-get owner-count) u1))
    
    (ok true)
))

;; Remove owner
(define-public (remove-owner (owner principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) (err u2001))
    (asserts! (default-to false (map-get? owners owner)) (err u2002))
    (asserts! (> (var-get owner-count) min-threshold) (err u2003))
    
    (map-delete owners owner)
    (var-set owner-count (- (var-get owner-count) u1))
    
    ;; Update threshold if needed
    (if (< (var-get threshold) (var-get owner-count))
      (var-set threshold (var-get owner-count))
      (ok true)
    )
    
    (ok true)
))

;; Change threshold
(define-public (change-threshold (new-threshold uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) (err u3001))
    (asserts! (>= new-threshold min-threshold) (err u3002))
    (asserts! (<= new-threshold (var-get owner-count)) (err u3003))
    
    (var-set threshold new-threshold)
    (ok true)
))

;; Submit transaction
(define-public (submit-transaction
    (to principal)
    (value uint)
    (data (buff 1024)))
  (begin
    (asserts! (default-to false (map-get? owners tx-sender)) (err u4001))
    
    (let ((tx-id (var-get next-tx-id)))
      (var-set next-tx-id (+ tx-id u1))
      
      ;; Create transaction
      (map-set transactions
        {tx-id: tx-id}
        {
          to: to,
          value: value,
          data: data,
          executed: false,
          num-confirmations: u0,
          created-at: (block-height)
        }
      )
      
      ;; Auto-confirm by submitter
      (try! (confirm-transaction tx-id))
      
      (ok tx-id)
    )
))

;; Confirm transaction
(define-public (confirm-transaction (tx-id uint))
  (begin
    (asserts! (default-to false (map-get? owners tx-sender)) (err u5001))
    (asserts! (is-some (map-get? transactions {tx-id: tx-id})) (err u5002))
    
    (let ((tx (unwrap-panic (map-get? transactions {tx-id: tx-id}))))
      (asserts! (not (get executed tx)) (err u5003))
      (asserts! (not (default-to false (map-get? confirmations {tx-id: tx-id, owner: tx-sender}))) (err u5004))
      
      ;; Add confirmation
      (map-set confirmations {tx-id: tx-id, owner: tx-sender} true)
      
      ;; Update confirmation count
      (let ((new-count (+ (get num-confirmations tx) u1)))
        (map-set transactions
          {tx-id: tx-id}
          (merge tx {num-confirmations: new-count})
        )
        
        ;; Auto-execute if threshold reached
        (if (>= new-count (var-get threshold))
          (try! (execute-transaction tx-id))
          (ok true)
        )
      )
    )
))

;; Execute transaction
(define-public (execute-transaction (tx-id uint))
  (begin
    (asserts! (is-some (map-get? transactions {tx-id: tx-id})) (err u6001))
    
    (let ((tx (unwrap-panic (map-get? transactions {tx-id: tx-id}))))
      (asserts! (not (get executed tx)) (err u6002))
      (asserts! (>= (get num-confirmations tx) (var-get threshold)) (err u6003))
      
      ;; Execute transfer
      (try! (stx-transfer? (get value tx) tx-sender (get to tx)))
      
      ;; Mark as executed
      (map-set transactions
        {tx-id: tx-id}
        (merge tx {executed: true})
      )
      
      (ok true)
    )
))

;; Revoke confirmation
(define-public (revoke-confirmation (tx-id uint))
  (begin
    (asserts! (default-to false (map-get? owners tx-sender)) (err u7001))
    (asserts! (is-some (map-get? transactions {tx-id: tx-id})) (err u7002))
    
    (let ((tx (unwrap-panic (map-get? transactions {tx-id: tx-id}))))
      (asserts! (not (get executed tx)) (err u7003))
      (asserts! (default-to false (map-get? confirmations {tx-id: tx-id, owner: tx-sender})) (err u7004))
      
      ;; Remove confirmation
      (map-delete confirmations {tx-id: tx-id, owner: tx-sender})
      
      ;; Update confirmation count
      (map-set transactions
        {tx-id: tx-id}
        (merge tx {num-confirmations: (- (get num-confirmations tx) u1)})
      )
      
      (ok true)
    )
))

;; Get transaction
(define-read-only (get-transaction (tx-id uint))
  (map-get? transactions {tx-id: tx-id})
)

;; Check if owner confirmed
(define-read-only (is-confirmed (tx-id uint) (owner principal))
  (default-to false (map-get? confirmations {tx-id: tx-id, owner: owner}))
)

;; Get threshold
(define-read-only (get-threshold)
  (var-get threshold)
)

;; Get owner count
(define-read-only (get-owner-count)
  (var-get owner-count)
)

;; Check if principal is owner
(define-read-only (is-owner (owner principal))
  (default-to false (map-get? owners owner))
)
;; Style improvement
