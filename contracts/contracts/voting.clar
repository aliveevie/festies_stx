;; Voting Contract v1.0.0
;; Community voting system for Festies DAO
;; Supports weighted voting and proposal management

(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_PROPOSAL_NOT_FOUND (err u101))
(define-constant ERR_ALREADY_VOTED (err u102))
(define-constant ERR_VOTING_CLOSED (err u103))
(define-constant ERR_INVALID_OPTION (err u104))
(define-constant ERR_INSUFFICIENT_STAKE (err u105))

(define-data-var contract-owner principal tx-sender)
(define-data-var proposal-count uint u0)

(define-map proposals
    uint
    {
        title: (string-ascii 100),
        description: (string-ascii 500),
        creator: principal,
        options: (list 10 (string-ascii 50)),
        start-time: uint,
        end-time: uint,
        status: (string-ascii 10),
        total-votes: uint
    }
)

(define-map votes
    { proposal-id: uint, voter: principal }
    { option-index: uint, weight: uint }
)

(define-map voter-weights
    principal
    uint
)

(define-private (assert-owner)
    (begin
        (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_UNAUTHORIZED)
        (ok true)
    )
)

(define-public (create-proposal
    (title (string-ascii 100))
    (description (string-ascii 500))
    (options (list 10 (string-ascii 50)))
    (duration-hours uint)
)
    (let (
        (id (+ (var-get proposal-count) u1))
        (current-time (stacks-block-height))
        (duration-seconds (* duration-hours u3600))
        (end-time (+ current-time duration-seconds))
    )
        (asserts! (> duration-hours u0) ERR_INVALID_OPTION)
        (asserts! (< duration-hours u720) ERR_INVALID_OPTION)
        (map-set proposals id {
            title: title,
            description: description,
            creator: tx-sender,
            options: options,
            start-time: current-time,
            end-time: end-time,
            status: "active",
            total-votes: u0
        })
        (var-set proposal-count id)
        (print { event: "proposal-created", proposal-id: id, creator: tx-sender })
        (ok id)
    )
)

(define-public (vote (proposal-id uint) (option-index uint) (weight uint))
    (let (
        (proposal (unwrap! (map-get? proposals proposal-id) ERR_PROPOSAL_NOT_FOUND))
        (current-time (stacks-block-height))
        (voter-weight (unwrap! (map-get? voter-weights tx-sender) (ok u0)))
        (vote-record (map-get? votes { proposal-id: proposal-id, voter: tx-sender }))
        (options (get options proposal))
    )
        (asserts! (is-eq (get status proposal) "active") ERR_VOTING_CLOSED)
        (asserts! (< current-time (get end-time proposal)) ERR_VOTING_CLOSED)
        (asserts! (is-none vote-record) ERR_ALREADY_VOTED)
        (asserts! (>= voter-weight weight) ERR_INSUFFICIENT_STAKE)
        (asserts! (< option-index (len options)) ERR_INVALID_OPTION)
        (map-set votes { proposal-id: proposal-id, voter: tx-sender } { option-index: option-index, weight: weight })
        (map-set proposals proposal-id {
            title: (get title proposal),
            description: (get description proposal),
            creator: (get creator proposal),
            options: options,
            start-time: (get start-time proposal),
            end-time: (get end-time proposal),
            status: "active",
            total-votes: (+ (get total-votes proposal) weight)
        })
        (print { 
            event: "vote-cast", 
            proposal-id: proposal-id, 
            voter: tx-sender, 
            option: option-index,
            weight: weight
        })
        (ok true)
    )
)

(define-public (set-voter-weight (voter principal) (weight uint))
    (begin
        (assert-owner)
        (map-set voter-weights voter weight)
        (print { event: "voter-weight-updated", voter: voter, weight: weight })
        (ok true)
    )
)

(define-public (close-proposal (proposal-id uint))
    (let (
        (proposal (unwrap! (map-get? proposals proposal-id) ERR_PROPOSAL_NOT_FOUND))
    )
        (assert-owner)
        (map-set proposals proposal-id {
            title: (get title proposal),
            description: (get description proposal),
            creator: (get creator proposal),
            options: (get options proposal),
            start-time: (get start-time proposal),
            end-time: (get end-time proposal),
            status: "closed",
            total-votes: (get total-votes proposal)
        })
        (print { event: "proposal-closed", proposal-id: proposal-id })
        (ok true)
    )
)

(define-read-only (get-proposal (id uint))
    (ok (map-get? proposals id))
)

(define-read-only (get-proposal-count)
    (ok (var-get proposal-count))
)

(define-read-only (get-vote (proposal-id uint) (voter principal))
    (ok (map-get? votes { proposal-id: proposal-id, voter: voter }))
)

(define-read-only (get-voter-weight (voter principal))
    (ok (map-get? voter-weights voter))
)
