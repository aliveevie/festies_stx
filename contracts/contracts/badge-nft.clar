;; Badge NFT v1.0.0
;; Soulbound achievement token for Festies platform
;; Non-transferable recognition tokens

(impl-trait .nft-trait.nft-trait)

(define-non-fungible-token badge uint)
(define-data-var last-id uint u0)

(define-constant STR_NFT_NOT_TRANSFERABLE (err u100))
(define-constant ERR_NOT_AUTHORIZED (err u101))

(define-read-only (get-last-token-id)
    (ok (var-get last-id))
)

(define-read-only (get-token-uri (token-id uint))
    (ok none) ;; Placeholder
)

(define-read-only (get-owner (token-id uint))
    (ok (nft-get-owner? badge token-id))
)

(define-public (transfer (token-id uint) (sender principal) (recipient principal))
    STR_NFT_NOT_TRANSFERABLE ;; Soulbound
)

(define-public (mint (recipient principal))
    (let ((id (+ (var-get last-id) u1)))
        (try! (nft-mint? badge id recipient))
        (var-set last-id id)
        (ok id)
    )
)
// Badge v1.0.1
// Badge v1.0.2
// Badge optimization 1
