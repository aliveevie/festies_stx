;; Fungible Token Contract v1.0.0
;; FSTX token for Festies platform
;; Implements SIP-010 fungible token standard

(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_INSUFFICIENT_BALANCE (err u101))
(define-constant ERR_INSUFFICIENT_ALLOWANCE (err u102))
(define-constant ERR_INVALID_AMOUNT (err u103))

(define-constant TOKEN-SYMBOL "FSTX")
(define-constant TOKEN-NAME "Festies Token")
(define-constant TOKEN-DECIMALS u6)

(define-data-var total-supply uint u1000000000)
(define-data-var contract-owner principal tx-sender)

(define-map balances principal uint)
(define-map allowances
    { owner: principal, spender: principal }
    uint
)

(define-private (assert-owner)
    (begin
        (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_UNAUTHORIZED)
        (ok true)
    )
)

(define-public (mint (amount uint) (recipient principal))
    (begin
        (assert-owner)
        (asserts! (> amount u0) ERR_INVALID_AMOUNT)
        (map-set balances recipient (+ (unwrap! (map-get? balances recipient) u0) amount))
        (var-set total-supply (+ (var-get total-supply) amount))
        (print { event: "tokens-minted", recipient: recipient, amount: amount })
        (ok true)
    )
)

(define-public (burn (amount uint))
    (let (
        (balance (unwrap! (map-get? balances tx-sender) u0))
    )
        (asserts! (>= balance amount) ERR_INSUFFICIENT_BALANCE)
        (asserts! (> amount u0) ERR_INVALID_AMOUNT)
        (map-set balances tx-sender (- balance amount))
        (var-set total-supply (- (var-get total-supply) amount))
        (print { event: "tokens-burned", burner: tx-sender, amount: amount })
        (ok true)
    )
)

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
    (let (
        (sender-balance (unwrap! (map-get? balances sender) u0))
    )
        (asserts! (is-eq tx-sender sender) ERR_UNAUTHORIZED)
        (asserts! (>= sender-balance amount) ERR_INSUFFICIENT_BALANCE)
        (asserts! (> amount u0) ERR_INVALID_AMOUNT)
        (map-set balances sender (- sender-balance amount))
        (map-set balances recipient (+ (unwrap! (map-get? balances recipient) u0) amount))
        (print { 
            event: "transfer", 
            sender: sender, 
            recipient: recipient, 
            amount: amount 
        })
        (ok true)
    )
)

(define-public (approve (amount uint) (spender principal) (sender principal))
    (begin
        (asserts! (is-eq tx-sender sender) ERR_UNAUTHORIZED)
        (map-set allowances { owner: sender, spender: spender } amount)
        (print { event: "approval", owner: sender, spender: spender, amount: amount })
        (ok true)
    )
)

(define-public (transfer-from (amount uint) (sender principal) (recipient principal) (caller principal) (memo (optional (buff 34))))
    (let (
        (sender-balance (unwrap! (map-get? balances sender) u0))
        (allowance (unwrap! (map-get? allowances { owner: sender, spender: caller }) u0))
    )
        (asserts! (is-eq tx-sender caller) ERR_UNAUTHORIZED)
        (asserts! (>= sender-balance amount) ERR_INSUFFICIENT_BALANCE)
        (asserts! (>= allowance amount) ERR_INSUFFICIENT_ALLOWANCE)
        (asserts! (> amount u0) ERR_INVALID_AMOUNT)
        (map-set balances sender (- sender-balance amount))
        (map-set balances recipient (+ (unwrap! (map-get? balances recipient) u0) amount))
        (map-set allowances { owner: sender, spender: caller } (- allowance amount))
        (print { 
            event: "transfer-from", 
            sender: sender, 
            recipient: recipient, 
            amount: amount,
            caller: caller
        })
        (ok true)
    )
)

(define-read-only (get-balance (account principal))
    (ok (unwrap! (map-get? balances account) u0))
)

(define-read-only (get-total-supply)
    (ok (var-get total-supply))
)

(define-read-only (get-allowance (owner principal) (spender principal))
    (ok (unwrap! (map-get? allowances { owner: owner, spender: spender }) u0))
)

(define-read-only (get-token-symbol)
    (ok TOKEN-SYMBOL)
)

(define-read-only (get-token-name)
    (ok TOKEN-NAME)
)

(define-read-only (get-decimals)
    (ok TOKEN-DECIMALS)
)
// Documentation update
