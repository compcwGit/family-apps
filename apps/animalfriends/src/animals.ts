// 동물 목록: 이름, 울음소리(음성으로 읽음), 색, 음성이 안 될 때 효과음 높이
// + 사는 곳, 먹이, 다리 수, 크기, 한마디. 여러 놀이(친구·퀴즈·그림자·피아노)가 같이 씀
// 동물을 늘리려면 core/Critter.tsx 에 그림을 추가하고 여기에 한 줄 더하기 → 모든 놀이에 자동으로 나옴
import type { CritterKind } from '@family/core'

export type Home = 'farm' | 'forest' | 'water' | 'plain'
export type FoodKind = 'carrot' | 'honey' | 'acorn' | 'banana' | 'grass' | 'fish' | 'bone' | 'grain' | 'leaf'

export type Animal = {
  critter: CritterKind
  name: string
  sound: string // 울음소리 또는 움직임 흉내말 (기린·물고기처럼 소리 없는 동물)
  color: string
  freq: number // 음성이 안 될 때 효과음 높이
  home: Home
  fact: string // 한마디 (만나기에서 읽어 줌)
  size: number // 크기 순서 비교용 (클수록 큼)
  legs?: 2 | 4 | 8 // 다리 수 퀴즈에 나올 동물만
  food?: FoodKind // 먹이 퀴즈에 나올 동물만
  also?: FoodKind[] // 이것도 먹어서 오답 보기에는 안 넣을 먹이
}

export const ANIMALS: Animal[] = [
  // 농장
  { critter: 'dog', name: '강아지', sound: '멍멍', color: '#FFB74D', freq: 523, home: 'farm', fact: '강아지는 기쁘면 꼬리를 흔들어요.', size: 3, legs: 4, food: 'bone' },
  { critter: 'cat', name: '고양이', sound: '야옹', color: '#F06292', freq: 659, home: 'farm', fact: '고양이는 높은 곳에 폴짝 올라가요.', size: 2, legs: 4, food: 'fish' },
  { critter: 'cow', name: '소', sound: '음매', color: '#81C784', freq: 262, home: 'farm', fact: '소는 우유를 줘요.', size: 7, legs: 4, food: 'grass', also: ['leaf'] },
  { critter: 'pig', name: '돼지', sound: '꿀꿀', color: '#F48FB1', freq: 392, home: 'farm', fact: '돼지는 코가 동글동글해요.', size: 5, legs: 4 },
  { critter: 'hen', name: '닭', sound: '꼬끼오', color: '#FF8A65', freq: 698, home: 'farm', fact: '닭은 아침에 꼬끼오 하고 울어요.', size: 2, legs: 2, food: 'grain' },
  { critter: 'chick', name: '병아리', sound: '삐약삐약', color: '#FFF176', freq: 880, home: 'farm', fact: '병아리는 닭의 아기예요.', size: 1, legs: 2, food: 'grain' },
  { critter: 'sheep', name: '양', sound: '매에', color: '#E0E0E0', freq: 440, home: 'farm', fact: '양은 폭신폭신한 털이 있어요.', size: 4, legs: 4, food: 'grass', also: ['leaf'] },
  { critter: 'horse', name: '말', sound: '히히힝', color: '#BCAAA4', freq: 330, home: 'farm', fact: '말은 아주 빨리 달려요.', size: 7, legs: 4, food: 'grass', also: ['carrot'] },
  // 숲
  { critter: 'rabbit', name: '토끼', sound: '깡충깡충', color: '#F8BBD0', freq: 740, home: 'forest', fact: '토끼는 귀가 길고 당근을 좋아해요.', size: 2, legs: 4, food: 'carrot', also: ['grass', 'leaf'] },
  { critter: 'bear', name: '곰', sound: '어슬렁', color: '#C08A5E', freq: 175, home: 'forest', fact: '곰은 꿀을 좋아해요.', size: 6, legs: 4, food: 'honey', also: ['fish'] },
  { critter: 'fox', name: '여우', sound: '캥캥', color: '#F08A3C', freq: 600, home: 'forest', fact: '여우는 꼬리가 폭신폭신해요.', size: 3, legs: 4 },
  { critter: 'squirrel', name: '다람쥐', sound: '쪼르르', color: '#B5703C', freq: 830, home: 'forest', fact: '다람쥐는 도토리를 모아요.', size: 1, legs: 4, food: 'acorn' },
  { critter: 'monkey', name: '원숭이', sound: '끼끼', color: '#9A6A45', freq: 760, home: 'forest', fact: '원숭이는 바나나를 좋아해요.', size: 3, food: 'banana', also: ['leaf'] },
  { critter: 'tiger', name: '호랑이', sound: '으르렁', color: '#FFA640', freq: 220, home: 'forest', fact: '호랑이는 줄무늬가 있어요.', size: 6, legs: 4 },
  // 물
  { critter: 'duck', name: '오리', sound: '꽥꽥', color: '#4FC3F7', freq: 587, home: 'water', fact: '오리는 물에서 헤엄쳐요.', size: 2, legs: 2 },
  { critter: 'frog', name: '개구리', sound: '개굴개굴', color: '#AED581', freq: 784, home: 'water', fact: '개구리는 폴짝폴짝 뛰어요.', size: 1, legs: 4 },
  { critter: 'fish', name: '물고기', sound: '뻐끔뻐끔', color: '#FF8A65', freq: 700, home: 'water', fact: '물고기는 물속에서 헤엄쳐요.', size: 1 },
  { critter: 'whale', name: '고래', sound: '우우웅', color: '#4A8FD8', freq: 147, home: 'water', fact: '고래는 바다에서 아주 큰 동물이에요.', size: 10 },
  { critter: 'turtle', name: '거북', sound: '엉금엉금', color: '#6BAF4A', freq: 370, home: 'water', fact: '거북은 등에 딱딱한 집이 있어요.', size: 4, legs: 4 },
  { critter: 'octopus', name: '문어', sound: '꿈틀꿈틀', color: '#C77DDB', freq: 480, home: 'water', fact: '문어는 다리가 여덟 개예요.', size: 4, legs: 8 },
  { critter: 'penguin', name: '펭귄', sound: '뒤뚱뒤뚱', color: '#3E4A6B', freq: 415, home: 'water', fact: '펭귄은 날지 못하고 뒤뚱뒤뚱 걸어요.', size: 3, legs: 2, food: 'fish' },
  // 초원
  { critter: 'lion', name: '사자', sound: '어흥', color: '#FFD54F', freq: 196, home: 'plain', fact: '사자는 동물의 왕이라고 불러요.', size: 6, legs: 4 },
  { critter: 'elephant', name: '코끼리', sound: '뿌우', color: '#B0BEC5', freq: 165, home: 'plain', fact: '코끼리는 긴 코로 물을 마셔요.', size: 9, legs: 4, food: 'grass', also: ['leaf', 'banana'] },
  { critter: 'giraffe', name: '기린', sound: '성큼성큼', color: '#FFD166', freq: 350, home: 'plain', fact: '기린은 목이 아주 길어요.', size: 8, legs: 4, food: 'leaf', also: ['grass'] },
]

export const HOMES: Record<Home, { name: string; place: string }> = {
  farm: { name: '농장', place: '농장에' },
  forest: { name: '숲', place: '숲에' },
  water: { name: '물', place: '물에' },
  plain: { name: '초원', place: '초원에' },
}
export const FOODS: Record<FoodKind, string> = {
  carrot: '당근',
  honey: '꿀',
  acorn: '도토리',
  banana: '바나나',
  grass: '풀',
  fish: '물고기',
  bone: '뼈다귀',
  grain: '모이',
  leaf: '나뭇잎',
}

// 엄마와 아기 (아기 그림은 따로 없어서 엄마 그림을 작게 보여 줌. 병아리만 진짜 그림)
export const BABIES: { mother: string; baby: string; critter?: CritterKind }[] = [
  { mother: '닭', baby: '병아리', critter: 'chick' },
  { mother: '소', baby: '송아지' },
  { mother: '말', baby: '망아지' },
  { mother: '돼지', baby: '새끼 돼지' },
  { mother: '양', baby: '새끼 양' },
  { mother: '고양이', baby: '새끼 고양이' },
]

export const byName = (n: string) => ANIMALS.find((a) => a.name === n)!

// 받침 유무에 따라 조사 고르기: 강아지는/닭은, 강아지예요/닭이에요
const hasBatchim = (word: string) => {
  const code = word.charCodeAt(word.length - 1) - 0xac00
  return code >= 0 && code <= 11171 && code % 28 !== 0
}
export const topic = (w: string) => w + (hasBatchim(w) ? '은' : '는')
export const isIt = (w: string) => w + (hasBatchim(w) ? '이에요' : '예요')
