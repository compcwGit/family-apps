import { useState } from 'react'
import { ParentGate, ParentPage, ParentSection, PlayShell, Segmented, createStore, setSpeechOptions, stopSpeaking, useStars, type SpeechOptions } from '@family/core'
import { JamoBoard } from './JamoBoard'
import { Builder } from './Builder'
import { Trace, type NumRead } from './Trace'
import { Listen } from './Listen'
import { FirstSound } from './FirstSound'
import { Missing } from './Missing'
import { WordOrder } from './WordOrder'
import { WordMatch } from './WordMatch'
import { VoiceSettings } from './VoiceSettings'
import pkg from '../package.json'
import './app.css'

const GAMES = [
  { id: 'jamo', label: 'ㄱㄴㄷ' },
  { id: 'build', label: '글자' },
  { id: 'trace', label: '따라' },
  { id: 'listen', label: '듣고' },
  { id: 'first', label: '첫소리' },
  { id: 'miss', label: '빈칸' },
  { id: 'order', label: '순서' },
  { id: 'match', label: '짝' },
] as const
type Screen = (typeof GAMES)[number]['id'] | 'gate' | 'parent'

// 읽기 설정 (부모 화면에서 변경). 기본: 아이가 또박또박 들을 수 있게 조금 천천히
const voiceStore = createStore<SpeechOptions>('hangulplay.voice', { rate: 0.75, pitch: 1.2, voice: '' })
setSpeechOptions(voiceStore.get())

// 따라쓰기를 끝낸 자모 목록 (기기 안에만 저장)
const store = createStore<string[]>('hangulplay.done', [])
// 숫자 읽는 소리 (부모 화면에서 선택)
const numStore = createStore<NumRead>('hangulplay.numRead', 'native')

// 한글 놀이: 자모 카드 + 글자 만들기 + 따라쓰기 + 듣고 찾기 + 첫소리 찾기 + 빈칸 + 글자 순서 + 짝 맞추기
export default function App() {
  const [screen, setScreen] = useState<Screen>('jamo')
  const [done, setDone] = useState(store.get)
  const [numRead, setNumRead] = useState(numStore.get)
  const [voice, setVoice] = useState(voiceStore.get)
  const stars = useStars('hangulplay.stars')
  const go = (s: Screen) => {
    stopSpeaking()
    setScreen(s)
  }
  const markDone = (ch: string) => {
    if (done.includes(ch)) return
    const next = [...done, ch]
    setDone(next)
    store.set(next)
  }

  if (screen === 'gate') return <ParentGate onPass={() => go('parent')} onCancel={() => go('jamo')} />
  if (screen === 'parent')
    return (
      <ParentPage
        title="한글 놀이"
        version={pkg.version}
        accent="#6EC1F5"
        about="자음·모음·쌍자음·이중모음 카드, 글자 만들기(ㄱ+ㅏ=가), 따라쓰기, 낱말 듣고 찾기, 첫소리 찾기, 빠진 글자 채우기, 글자 순서 맞추기, 그림-낱말 짝 맞추기로 한글을 익히는 유아용 앱입니다."
        nuri={[['의사소통', '자모 카드, 글자 만들기, 따라 쓰기, 빠진 글자 채우기, 글자 순서 맞추기, 그림-낱말 짝 맞추기 (읽기와 쓰기에 관심 가지기), 듣고 찾기, 첫소리 찾기 (듣기와 말하기)']]}
        stars={[
          ['듣고 찾기', stars.of('listen')],
          ['첫소리 찾기', stars.of('first')],
          ['빠진 글자 채우기', stars.of('miss')],
          ['글자 순서 맞추기', stars.of('order')],
          ['그림-낱말 짝 맞추기', stars.of('match')],
        ]}
        onReset={stars.reset}
        onClose={() => go('jamo')}
      >
        <ParentSection
          title="따라쓰기 진도"
          action={
            <button
              className="sb-pill quiet"
              onClick={() => {
                setDone([])
                store.set([])
              }}
            >
              진도 초기화
            </button>
          }
        >
          <p>따라쓰기 완료: {done.length} / 34 (한글 24 + 숫자 10)</p>
        </ParentSection>
        <ParentSection title="숫자 읽는 소리">
          <Segmented
            label="숫자 읽는 소리"
            value={numRead}
            options={[
              ['native', '하나, 둘, 셋'],
              ['sino', '일, 이, 삼'],
            ]}
            onChange={(r) => {
              setNumRead(r)
              numStore.set(r)
            }}
          />
        </ParentSection>
        <VoiceSettings
          title="목소리"
          value={voice}
          onChange={(v) => {
            setVoice(v)
            voiceStore.set(v)
          }}
        />
      </ParentPage>
    )

  return (
    <PlayShell app="한글 놀이" accent="#6EC1F5" games={GAMES} active={screen} onPick={(id) => go(id as Screen)} onParent={() => go('gate')}>
      {screen === 'jamo' && <JamoBoard done={done} />}
      {screen === 'build' && <Builder />}
      {screen === 'trace' && <Trace done={done} onDone={markDone} numRead={numRead} />}
      {screen === 'listen' && <Listen stars={stars.of('listen')} onStar={() => stars.add('listen')} />}
      {screen === 'first' && <FirstSound stars={stars.of('first')} onStar={() => stars.add('first')} />}
      {screen === 'miss' && <Missing stars={stars.of('miss')} onStar={() => stars.add('miss')} />}
      {screen === 'order' && <WordOrder stars={stars.of('order')} onStar={() => stars.add('order')} />}
      {screen === 'match' && <WordMatch stars={stars.of('match')} onStar={() => stars.add('match')} />}
    </PlayShell>
  )
}
