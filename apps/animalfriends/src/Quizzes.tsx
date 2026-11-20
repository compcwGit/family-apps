import { Critter, pick, shuffle, type GameProps } from '@family/core'
import { ANIMALS, FOODS, HOMES, byName, type Animal, type FoodKind, type Home } from './animals'
import { Choice, type Make, type Option } from './Choice'
import { FoodIcon, PlaceIcon } from './Icons'
import { SAY } from './voice'

// 퀴즈 4종 (모두 Choice 틀): 소리 · 이름 · 누구일까 · 다리. 사는 곳 · 먹이도 같은 틀이라 여기에 같이 둠
const others = <T,>(answer: T, pool: readonly T[], n: number) => shuffle(pool.filter((x) => x !== answer)).slice(0, n)
const fresh = (prev?: { answer: string }) => ANIMALS.filter((a) => a.name !== prev?.answer)
const withLabel = (a: Animal, size = 150): Option => ({
  id: a.name,
  view: (
    <>
      <Critter kind={a.critter} size={size} />
      <span className="label">{a.name}</span>
    </>
  ),
})
const picture = (a: Animal, size = 120): Option => ({ id: a.name, view: <Critter kind={a.critter} size={size} /> })

// 소리 듣고 맞히기
const soundMake: Make = (_s, prev) => {
  const a = pick(fresh(prev))
  return { ask: SAY.quizAsk(a), options: shuffle([a, ...others(a, ANIMALS, 3)]).map((x) => withLabel(x)), answer: a.name, ok: SAY.quizOk(a), no: (id) => SAY.quizNo(byName(id)) }
}
export const SoundQuiz = (p: GameProps) => <Choice {...p} make={soundMake} />

// 이름 듣고 그림 찾기 (글자 없이 그림만)
const nameMake: Make = (_s, prev) => {
  const a = pick(fresh(prev))
  return { ask: SAY.findAsk(a), options: shuffle([a, ...others(a, ANIMALS, 3)]).map((x) => picture(x, 170)), answer: a.name, ok: SAY.quizOk(a), no: (id) => SAY.findNo(byName(id)) }
}
export const NameQuiz = (p: GameProps) => <Choice {...p} make={nameMake} />

// 누구일까: 얼굴 한가운데만 크게 보여 주고 맞히기
const whoMake: Make = (_s, prev) => {
  const a = pick(fresh(prev))
  return {
    ask: SAY.whoAsk,
    prompt: (
      <div className="peek">
        <Critter kind={a.critter} size={380} />
      </div>
    ),
    options: shuffle([a, ...others(a, ANIMALS, 3)]).map((x) => picture(x, 130)),
    answer: a.name,
    ok: SAY.quizOk(a),
    no: () => SAY.whoNo,
  }
}
export const WhoQuiz = (p: GameProps) => <Choice {...p} make={whoMake} side size={200} psize={150} />

// 다리가 몇 개?
const legsPool = ANIMALS.filter((a) => a.legs)
const legsMake: Make = (_s, prev) => {
  const a = pick(legsPool.filter((x) => x.name !== prev?.answer))
  const num = (n: number): Option => ({
    id: String(n),
    view: (
      <>
        <b className="num">{n}</b>
        <span className="dots">{Array.from({ length: n }, (_, i) => <i key={i} />)}</span>
      </>
    ),
  })
  return { ask: SAY.legsAsk(a), prompt: <Critter kind={a.critter} size={210} />, options: [2, 4, 8].map(num), answer: String(a.legs), ok: SAY.legsOk(a), no: () => SAY.legsNo }
}
export const LegsQuiz = (p: GameProps) => <Choice {...p} make={legsMake} cols={3} size={200} psize={118} />

// 어디에 살까? (사는 곳 4곳 중에서)
const HOME_LIST = Object.keys(HOMES) as Home[]
const homeMake: Make = (_s, prev) => {
  const a = pick(fresh(prev))
  return {
    ask: SAY.homeAsk(a),
    prompt: <Critter kind={a.critter} size={260} />,
    options: HOME_LIST.map((h) => ({
      id: h,
      view: (
        <>
          <PlaceIcon kind={h} size={110} />
          <span className="label">{HOMES[h].name}</span>
        </>
      ),
    })),
    answer: a.home,
    ok: SAY.homeOk(a),
    no: () => SAY.homeNo(a),
  }
}
export const HomeQuiz = (p: GameProps) => <Choice {...p} make={homeMake} side size={200} psize={150} />

// 뭘 먹을까? (정답 + 안 먹는 먹이 2개)
const eatPool = ANIMALS.filter((a) => a.food)
const eatMake: Make = (_s, prev) => {
  const a = pick(eatPool.filter((x) => x.name !== prev?.answer))
  const ok = [a.food!, ...(a.also ?? [])]
  const wrong = shuffle((Object.keys(FOODS) as FoodKind[]).filter((f) => !ok.includes(f))).slice(0, 2)
  return {
    ask: SAY.eatAsk(a),
    prompt: <Critter kind={a.critter} size={200} />,
    options: shuffle([a.food!, ...wrong]).map((f) => ({
      id: f,
      view: (
        <>
          <FoodIcon kind={f} size={120} />
          <span className="label">{FOODS[f]}</span>
        </>
      ),
    })),
    answer: a.food!,
    ok: SAY.eatOk(a),
    no: () => SAY.eatNo(a),
  }
}
export const EatQuiz = (p: GameProps) => <Choice {...p} make={eatMake} cols={3} size={200} psize={118} />
