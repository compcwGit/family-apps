import { useRef, useState } from 'react'
import { Critter, speak } from '@family/core'
import { ANIMALS, type Animal } from './animals'
import { SAY } from './voice'

// 동물 만나기: 12마리씩 쪽 넘기기 (스크롤 없음). 누르면 이름 · 울음소리 · 한마디를 읽어 주고 통통 튐
const PAGE = 12
const PAGES = Math.ceil(ANIMALS.length / PAGE)

export function Meet() {
  const [page, setPage] = useState(0)
  const [active, setActive] = useState<Animal | null>(null)
  const [pop, setPop] = useState<string | null>(null)
  const timer = useRef(0)

  const go = (n: number) => {
    setPage(n)
    setActive(null)
  }

  const tap = (a: Animal) => {
    speak(`${SAY.board(a)} ${SAY.fact(a)}`, a.freq)
    setActive(a)
    setPop(a.name)
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setPop(null), 500)
  }

  return (
    <div className="meet">
      <div className="meet-grid">
        {ANIMALS.slice(page * PAGE, page * PAGE + PAGE).map((a) => (
          <button key={a.name} className={pop === a.name ? 'card pop' : 'card'} onClick={() => tap(a)}>
            <Critter kind={a.critter} size={96} />
            <span className="label">{a.name}</span>
          </button>
        ))}
      </div>
      <div className="meet-bar">
        <button className="pager" aria-label="앞 쪽" disabled={page === 0} onClick={() => go(page - 1)}>
          ◀
        </button>
        <p className="meet-fact">{active ? active.fact : '동물을 눌러 보세요!'}</p>
        <button className="pager" aria-label="다음 쪽" disabled={page === PAGES - 1} onClick={() => go(page + 1)}>
          ▶
        </button>
      </div>
    </div>
  )
}
