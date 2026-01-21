;; Governance Contract v1.0.0
;; Advanced governance system for Festies DAO
;; Supports delegation, proposals, and voting

(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_PROPOSAL_NOT_FOUND (err u101))
(define-constant ERR_ALREADY_VOTED (err u102))
(define-constant ERR_VOTING_CLOSED (err u103))
(define-constant ERR_INVALID_PARAMS (err u104))
(define-constant ERR_INSUFFICIENT_VOTING_POWER (err u105))

(define-data-var contract-owner principal tx-sender)
(define-data-var proposal-count uint u0)
(define-data-var quorum-threshold uint u100)

(define-map proposals
    uint
    {
        title: (string-ascii 100),
        description: (string-ascii 1000),
        proposer: principal,
        votes-for: uint,
        votes-against: uint,
        votes-abstain: uint,
        start-time: uint,
        end-time: uint,
        status: (string-ascii 10),
        execution-data: (optional (buff 1024))
    }
)

(define-map votes
    { proposal-id: uint, voter: principal }
    { vote-type: (string-ascii 10), weight: uint }
)

(define-map voting-power
    principal
    uint
)

(define-map delegations
    principal
    principal
)

(define-private (assert-owner)
    (begin
        (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_UNAUTHORIZED)
        (ok true)
    )
)

(define-public (create-proposal
    (title (string-ascii 100))
    (description (string-ascii 1000))
    (duration-hours uint)
    (execution-data (optional (buff 1024)))
)
    (let (
        (id (+ (var-get proposal-count) u1))
        (current-time (stacks-block-height))
        (duration-seconds (* duration-hours u3600))
        (end-time (+ current-time duration-seconds))
        (voting-power-amount (unwrap! (map-get? voting-power tx-sender) u0))
    )
        (asserts! (> voting-power-amount u0) ERR_INSUFFICIENT_VOTING_POWER)
        (asserts! (> duration-hours u0) ERR_INVALID_PARAMS)
        (asserts! (< duration-hours u1680) ERR_INVALID_PARAMS)
        (map-set proposals id {
            title: title,
            description: description,
            proposer: tx-sender,
            votes-for: u0,
            votes-against: u0,
            votes-abstain: u0,
            start-time: current-time,
            end-time: end-time,
            status: "active",
            execution-data: execution-data
        })
        (var-set proposal-count id)
        (print { event: "proposal-created", proposal-id: id, proposer: tx-sender })
        (ok id)
    )
)

(define-public (vote (proposal-id uint) (vote-type (string-ascii 10)) (weight uint))
    (let (
        (proposal (unwrap! (map-get? proposals proposal-id) ERR_PROPOSAL_NOT_FOUND))
        (current-time (stacks-block-height))
        (voter-power (unwrap! (map-get? voting-power tx-sender) u0))
        (vote-record (map-get? votes { proposal-id: proposal-id, voter: tx-sender }))
        (effective-delegate (unwrap! (map-get? delegations tx-sender) tx-sender))
        (delegated-power (unwrap! (map-get? voting-power effective-delegate) u0))
    )
        (asserts! (is-eq (get status proposal) "active") ERR_VOTING_CLOSED)
        (asserts! (< current-time (get end-time proposal)) ERR_VOTING_CLOSED)
        (asserts! (is-none vote-record) ERR_ALREADY_VOTED)
        (asserts! (>= voter-power weight) ERR_INSUFFICIENT_VOTING_POWER)
        (asserts! (or 
            (is-eq vote-type "for") 
            (is-eq vote-type "against") 
            (is-eq vote-type "abstain")
        ) ERR_INVALID_PARAMS)
        (map-set votes { proposal-id: proposal-id, voter: tx-sender } { vote-type: vote-type, weight: weight })
        (map-set proposals proposal-id {
            title: (get title proposal),
            description: (get description proposal),
            proposer: (get proposer proposal),
            votes-for: (if (is-eq vote-type "for") (+ (get votes-for proposal) weight) (get votes-for proposal)),
            votes-against: (if (is-eq vote-type "against") (+ (get votes-against proposal) weight) (get votes-against proposal)),
            votes-abstain: (if (is-eq vote-type "abstain") (+ (get votes-abstain proposal) weight) (get votes-abstain proposal)),
            start-time: (get start-time proposal),
            end-time: (get end-time proposal),
            status: "active",
            execution-data: (get execution-data proposal)
        })
        (print { 
            event: "vote-cast", 
            proposal-id: proposal-id, 
            voter: tx-sender, 
            vote-type: vote-type,
            weight: weight
        })
        (ok true)
    )
)

(define-public (delegate-voting-power (delegate principal))
    (begin
        (let ((current-power (unwrap! (map-get? voting-power tx-sender) u0)))
            (asserts! (> current-power u0) ERR_INSUFFICIENT_VOTING_POWER)
            (map-set delegations tx-sender delegate)
            (print { event: "voting-power-delegated", delegator: tx-sender, delegate: delegate })
            (ok true)
        )
    )
)

(define-public (set-voting-power (account principal) (power uint))
    (begin
        (assert-owner)
        (map-set voting-power account power)
        (print { event: "voting-power-updated", account: account, power: power })
        (ok true)
    )
)

(define-public (execute-proposal (proposal-id uint))
    (let (
        (proposal (unwrap! (map-get? proposals proposal-id) ERR_PROPOSAL_NOT_FOUND))
        (current-time (stacks-block-height))
        (votes-for (get votes-for proposal))
        (votes-against (get votes-against proposal))
        (total-votes (+ votes-for votes-against))
        (quorum (var-get quorum-threshold))
    )
        (assert-owner)
        (asserts! (>= current-time (get end-time proposal)) ERR_VOTING_CLOSED)
        (asserts! (> votes-for votes-against) ERR_INVALID_PARAMS)
        (map-set proposals proposal-id {
            title: (get title proposal),
            description: (get description proposal),
            proposer: (get proposer proposal),
            votes-for: votes-for,
            votes-against: votes-against,
            votes-abstain: (get votes-abstain proposal),
            start-time: (get start-time proposal),
            end-time: (get end-time proposal),
            status: "executed",
            execution-data: (get execution-data proposal)
        })
        (print { event: "proposal-executed", proposal-id: proposal-id })
        (ok true)
    )
)

(define-public (set-quorum-threshold (threshold uint))
    (begin
        (assert-owner)
        (var-set quorum-threshold threshold)
        (print { event: "quorum-threshold-updated", threshold: threshold })
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

(define-read-only (get-voting-power (account principal))
    (ok (map-get? voting-power account))
)

(define-read-only (get-delegation (account principal))
    (ok (map-get? delegations account))
)

(define-read-only (get-quorum-threshold)
    (ok (var-get quorum-threshold))
)
