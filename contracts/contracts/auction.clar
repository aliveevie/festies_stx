;; Auction Contract v1.0.0
;; NFT auction system for Festies marketplace
;; Supports time-based auctions with automatic settlement

(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_AUCTION_NOT_FOUND (err u101))
(define-constant ERR_AUCTION_ENDED (err u102))
(define-constant ERR_AUCTION_ACTIVE (err u103))
(define-constant ERR_INSUFFICIENT_BID (err u104))
(define-constant ERR_INVALID_DURATION (err u105))
(define-constant ERR_INVALID_TOKEN_ID (err u106))

(define-data-var contract-owner principal tx-sender)
(define-data-var auction-count uint u0)

(define-map auctions
    uint
    {
        token-id: uint,
        seller: principal,
        start-price: uint,
        current-bid: uint,
        current-bidder: principal,
        start-time: uint,
        end-time: uint,
        status: (string-ascii 10)
    }
)

(define-map bids
    { auction-id: uint, bidder: principal }
    uint
)

(define-private (assert-owner)
    (begin
        (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_UNAUTHORIZED)
        (ok true)
    )
)

(define-public (create-auction
    (token-id uint)
    (start-price uint)
    (duration-hours uint)
)
    (let (
        (id (+ (var-get auction-count) u1))
        (current-time (stacks-block-height))
        (duration-seconds (* duration-hours u3600))
        (end-time (+ current-time duration-seconds))
    )
        (asserts! (> start-price u0) ERR_INVALID_DURATION)
        (asserts! (> duration-hours u0) ERR_INVALID_DURATION)
        (asserts! (< duration-hours u168) ERR_INVALID_DURATION)
        (map-set auctions id {
            token-id: token-id,
            seller: tx-sender,
            start-price: start-price,
            current-bid: u0,
            current-bidder: tx-sender,
            start-time: current-time,
            end-time: end-time,
            status: "active"
        })
        (var-set auction-count id)
        (print { event: "auction-created", auction-id: id, token-id: token-id, seller: tx-sender })
        (ok id)
    )
)

(define-public (place-bid (auction-id uint) (bid-amount uint))
    (let (
        (auction (unwrap! (map-get? auctions auction-id) ERR_AUCTION_NOT_FOUND))
        (current-time (stacks-block-height))
        (current-bid (get current-bid auction))
        (min-bid (* (+ current-bid (/ current-bid u10)) u1))
    )
        (asserts! (is-eq (get status auction) "active") ERR_AUCTION_ENDED)
        (asserts! (< current-time (get end-time auction)) ERR_AUCTION_ENDED)
        (asserts! (>= bid-amount min-bid) ERR_INSUFFICIENT_BID)
        (map-set bids { auction-id: auction-id, bidder: tx-sender } bid-amount)
        (map-set auctions auction-id {
            token-id: (get token-id auction),
            seller: (get seller auction),
            start-price: (get start-price auction),
            current-bid: bid-amount,
            current-bidder: tx-sender,
            start-time: (get start-time auction),
            end-time: (get end-time auction),
            status: "active"
        })
        (print { event: "bid-placed", auction-id: auction-id, bidder: tx-sender, amount: bid-amount })
        (ok true)
    )
)

(define-public (settle-auction (auction-id uint))
    (let (
        (auction (unwrap! (map-get? auctions auction-id) ERR_AUCTION_NOT_FOUND))
        (current-time (stacks-block-height))
        (status (get status auction))
    )
        (asserts! (is-eq status "active") ERR_AUCTION_ENDED)
        (asserts! (>= current-time (get end-time auction)) ERR_AUCTION_ACTIVE)
        (map-set auctions auction-id {
            token-id: (get token-id auction),
            seller: (get seller auction),
            start-price: (get start-price auction),
            current-bid: (get current-bid auction),
            current-bidder: (get current-bidder auction),
            start-time: (get start-time auction),
            end-time: (get end-time auction),
            status: "settled"
        })
        (print { 
            event: "auction-settled", 
            auction-id: auction-id,
            winner: (get current-bidder auction),
            final-bid: (get current-bid auction)
        })
        (ok true)
    )
)

(define-read-only (get-auction (id uint))
    (ok (map-get? auctions id))
)

(define-read-only (get-auction-count)
    (ok (var-get auction-count))
)

(define-read-only (get-bid (auction-id uint) (bidder principal))
    (ok (map-get? bids { auction-id: auction-id, bidder: bidder }))
)
// Refactor improvement
