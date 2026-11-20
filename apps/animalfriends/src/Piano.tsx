import { useEffect, useRef, useState } from 'react'
import { Critter, GameTop, Party, playPiano, speak, useFeedback, useSay, type GameProps } from '@family/core'
import { ANIMALS } from './animals'
import { SONGS } from './songs'
import { SAY } from './voice'

// 동물 피아노: 건반 8개(도~높은 도). 세 가지 놀이
//  - 동물 건반: 누르면 동물 울음소리 (피아노 소리로 바꿀 수도 있음)
//  - 따라 치기: 불이 켜진 건반을 차례로 눌러 노래 완성
//  - 자유 연주: 마음대로 치고, 친 순서를 다시 들어 보기 (마이크 없이 누른 순서만 기억)
const KEYS = [
  { note: '도', freq: 262, color: '#EF5350' },
  { note: '레', freq: 294, color: '#FF9800' },
  { note: '미', freq: 330, color: '#FFEB3B' },
  { note: '파', freq: 349, color: '#66BB6A' },
  { note: '솔', freq: 392, color: '#42A5F5' },
  { note: '라', freq: 440, color: '#3F51B5' },
  { note: '시', freq: 494, color: '#AB47BC' },
  { note: '도', freq: 523, color: '#F48FB1' },
]
const ANIMAL_KEYS = ['소', '돼지', '사자', '강아지', '고양이', '오리', '닭', '병아리'].map((n) => ANIMALS.find((a) => a.name === n)!)

function Keys({ down, click, glow }: { down?: (i: number) => void; click?: (i: number) => void; glow?: number }) {
  const [hit, setHit] = useState<number | null>(null)
  const flash = (i: number) => {
    setHit(i)
    setTimeout(() => setHit((h) => (h === i ? null : h)), 250)
  }
  return (
    <div className="piano">
      {KEYS.map((k, i) => (
        <button
          key={i}
          className={'piano-key' + (hit === i ? ' hit' : '') + (glow === i ? ' glow' : '')}
          style={{ background: k.color }}
          onPointerDown={() => {
            flash(i)
            down?.(i)
          }}
          onClick={() => click?.(i)}
        >
          <span className="piano-animal"><Critter kind={ANIMAL_KEYS[i].critter} size={72} /></span>
          <span className="piano-note">{k.note}</span>
        </button>
      ))}
    </div>
  )
}

// 동물 건반 — 피아노 소리는 닿는 순간(빠르게), 동물 소리는 탭(click): 아이폰은 탭 안에서만 기기 음성을 허락함
export function AnimalPiano() {
  const [animal, setAnimal] = useState(true)
  return (
    <div className="g-game">
      <div className="piano-mode" role="radiogroup" aria-label="소리 고르기">
        <button role="radio" aria-checked={animal} className={animal ? 'on' : ''} onClick={() => setAnimal(true)}>
          동물 소리
        </button>
        <button role="radio" aria-checked={!animal} className={animal ? '' : 'on'} onClick={() => setAnimal(false)}>
          피아노 소리
        </button>
      </div>
      <Keys
        down={(i) => !animal && playPiano(KEYS[i].freq)}
        click={(i) => animal && speak(SAY.piano(ANIMAL_KEYS[i]), KEYS[i].freq)}
      />
    </div>
  )
}

// 자유 연주 — 친 순서를 점으로 보여 주고 '다시 듣기'
export function FreePiano() {
  const [seq, setSeq] = useState<number[]>([])
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const replay = () => {
    timers.current.forEach(clearTimeout)
    timers.current = seq.map((k, n) => window.setTimeout(() => playPiano(KEYS[k].freq), n * 420))
  }
  return (
    <div className="g-game">
      <p className="piano-hint">{SAY.freeAsk}</p>
      <div className="seq" aria-label="친 건반">
        {seq.map((k, n) => (
          <i key={n} style={{ background: KEYS[k].color }} />
        ))}
      </div>
      <Keys
        down={(i) => {
          playPiano(KEYS[i].freq)
          setSeq((s) => [...s, i].slice(-16))
        }}
      />
      <div className="piano-mode">
        <button disabled={!seq.length} onClick={replay}>
          다시 듣기
        </button>
        <button disabled={!seq.length} onClick={() => setSeq([])}>
          지우기
        </button>
      </div>
    </div>
  )
}

// 따라 치기 — 불이 켜진 건반을 순서대로. 틀려도 벌점 없이 계속 (눌러야 할 건반은 계속 켜져 있음)
export function FollowPiano({ stars, onStar }: GameProps) {
  const [song, setSong] = useState(0)
  const [step, setStep] = useState(0)
  const fb = useFeedback(onStar)
  const notes = SONGS[song].notes
  const ask = SAY.followAsk(SONGS[song].title)
  useSay(ask, [song])

  const press = (i: number) => {
    if (fb.busy()) return
    if (i !== notes[step]) return fb.no(String(i), SAY.followNo)
    playPiano(KEYS[i].freq)
    if (step + 1 < notes.length) return setStep(step + 1)
    fb.ok(SAY.followOk, () => {
      setStep(0)
      setSong((song + 1) % SONGS.length)
    })
  }

  return (
    <div className="g-game">
      <GameTop stars={stars} onAgain={() => speak(ask)}>
        {ask}
      </GameTop>
      <div className="piano-mode" role="radiogroup" aria-label="노래 고르기">
        {SONGS.map((s, n) => (
          <button
            key={s.id}
            role="radio"
            aria-checked={n === song}
            className={n === song ? 'on' : ''}
            onClick={() => {
              setSong(n)
              setStep(0)
            }}
          >
            {s.title}
          </button>
        ))}
      </div>
      <div className="seq" aria-label={`${step} / ${notes.length}`}>
        {notes.map((k, n) => (
          <i key={n} style={{ background: n < step ? KEYS[k].color : '#E9E1CF' }} />
        ))}
      </div>
      <Keys click={press} glow={notes[step]} />
      <Party show={fb.party} text={fb.line} />
    </div>
  )
}
