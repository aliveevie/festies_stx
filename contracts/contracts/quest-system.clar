;; Quest System
;; Quest management and XP tracking

(define-map user-xp principal uint)
(define-map quests
    uint 
    {
        name: (string-ascii 50),
        xp-reward: uint
    }
)

(define-public (complete-quest (quest-id uint))
    (let (
        (xp (default-to u0 (map-get? user-xp tx-sender)))
        (quest (unwrap! (map-get? quests quest-id) (err u404)))
    )
        (map-set user-xp tx-sender (+ xp (get xp-reward quest)))
        (ok true)
    )
)

(define-public (add-quest (id uint) (name (string-ascii 50)) (reward uint))
    (begin
        (map-set quests id { name: name, xp-reward: reward })
        (ok true)
    )
)
;; Quest System for Festival Gamification
