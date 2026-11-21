// 유료 잠금 화면 — docs/ideas/006-paid-unlock.md
// - LockedPlay: 아이가 잠긴 놀이를 눌렀을 때 (결제 버튼 없음, "엄마·아빠 부르기"만 → 부모 잠금)
// - UnlockSection: 부모 화면 "전체 기능" 칸 (무료/유료 놀이 목록, 구매, 구매 복원)
import { useEffect, useState } from 'react'
import { canPurchase, priceOf, purchaseFull, restoreFull, useUnlocked } from './billing'
import { ParentSection } from './ParentPage'
import { LockIcon } from './icons'

export function LockedPlay({ name, onAsk }: { name: string; onAsk: () => void }) {
  return (
    <div className="lock-play">
      <div className="lock-badge" aria-hidden>
        <LockIcon size={84} />
      </div>
      <p className="lock-title">{name}</p>
      <p className="lock-text">이 놀이는 엄마·아빠가 열어 줄 수 있어요</p>
      <button className="core-btn lock-ask" onClick={onAsk}>
        엄마·아빠 부르기
      </button>
    </div>
  )
}

// title 은 부모 화면 탭 이름으로 쓰임 (ParentPage 가 props.title 을 읽음)
export function UnlockSection({ app, free, paid }: { title: string; app: string; free: string[]; paid: string[] }) {
  const unlocked = useUnlocked(app)
  const [price, setPrice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  useEffect(() => {
    if (!unlocked) priceOf(app).then(setPrice)
  }, [app, unlocked])

  const run = async (f: () => Promise<boolean>, ok: string, none: string) => {
    setBusy(true)
    setMsg('')
    try {
      setMsg((await f()) ? ok : none)
    } catch (e) {
      const text = e instanceof Error ? e.message : String(e)
      setMsg(/cancel/i.test(text) ? '구매를 취소했어요.' : `잠시 뒤 다시 해 주세요. (${text})`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <ParentSection title="전체 기능">
      {unlocked ? (
        <p>
          <b>전체 기능이 열려 있어요.</b> 모든 놀이를 할 수 있어요. 감사합니다!
        </p>
      ) : (
        <p>
          무료 놀이는 언제든 할 수 있어요. 한 번 구매하면 나머지 놀이가 모두 열리고, 계속 쓸 수 있어요.
        </p>
      )}
      <ul className="lock-list">
        <li>
          <span className="sb-chip">무료</span>
          <span>{free.join(', ')}</span>
        </li>
        <li>
          <span className="sb-chip">{unlocked ? '열림' : '전체 기능'}</span>
          <span>{paid.join(', ')}</span>
        </li>
      </ul>
      {!unlocked &&
        (canPurchase() ? (
          <div className="lock-actions">
            <button className="sb-pill" disabled={busy} onClick={() => run(() => purchaseFull(app), '전체 기능이 열렸어요!', '구매가 끝나지 않았어요. 결제가 완료되면 "구매 복원"을 눌러 주세요.')}>
              전체 기능 열기{price ? ` · ${price}` : ''}
            </button>
            <button className="sb-pill quiet" disabled={busy} onClick={() => run(() => restoreFull(app), '구매 내역을 찾아 전체 기능을 열었어요.', '이 Google 계정의 구매 내역이 없어요.')}>
              구매 복원
            </button>
          </div>
        ) : (
          <p className="muted">전체 기능은 Google Play 의 안드로이드 앱에서 구매할 수 있어요. (아이폰 웹앱·PC 결제는 준비 중)</p>
        ))}
      {msg && <p className="lock-msg">{msg}</p>}
      <p className="muted">1회 구매(구독 아님) · 결제는 Google Play 가 처리하며, 개발자는 카드·계정 정보를 받지 않아요.</p>
    </ParentSection>
  )
}
