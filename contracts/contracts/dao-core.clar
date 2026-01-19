;; DAO Core Logic v1.0.0
;; Implements decentralized governance for Festies
;; Supports proposal creation and community voting

(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_ALREADY_VOTED (err u101))
(define-constant ERR_PROPOSAL_NOT_FOUND (err u102))

(define-map proposals
    uint
    {
        title: (string-ascii 50),
        votes-for: uint,
        votes-against: uint,
        status: (string-ascii 10)
    }
)

(define-map votes
    { proposal-id: uint, voter: principal }
    { decision: bool }
)

(define-data-var proposal-count uint u0)

(define-public (create-proposal (title (string-ascii 50)))
    (let ((id (+ (var-get proposal-count) u1)))
        (map-set proposals id {
            title: title,
            votes-for: u0,
            votes-against: u0,
            status: "active"
        })
        (var-set proposal-count id)
        (ok id)
    )
)

(define-public (vote (proposal-id uint) (approve bool))
    (let (
        (proposal (unwrap! (map-get? proposals proposal-id) ERR_PROPOSAL_NOT_FOUND))
        (voter-record (map-get? votes { proposal-id: proposal-id, voter: tx-sender }))
    )
        (asserts! (is-none voter-record) ERR_ALREADY_VOTED)
        (map-set votes { proposal-id: proposal-id, voter: tx-sender } { decision: approve })
        (ok true)
    )
)

(define-read-only (get-proposal (id uint))
    (ok (map-get? proposals id))
)
