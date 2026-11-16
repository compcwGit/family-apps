// 동물 목록: 이름, 울음소리(음성으로 읽음), 색, 음성이 안 될 때 효과음 높이
export type Animal = { emoji: string; name: string; sound: string; color: string; freq: number }

export const ANIMALS: Animal[] = [
  { emoji: '🐶', name: '강아지', sound: '멍멍', color: '#FFB74D', freq: 523 },
  { emoji: '🐱', name: '고양이', sound: '야옹', color: '#F06292', freq: 659 },
  { emoji: '🐮', name: '소', sound: '음매', color: '#81C784', freq: 262 },
  { emoji: '🐷', name: '돼지', sound: '꿀꿀', color: '#F48FB1', freq: 392 },
  { emoji: '🐸', name: '개구리', sound: '개굴개굴', color: '#AED581', freq: 784 },
  { emoji: '🦁', name: '사자', sound: '어흥', color: '#FFD54F', freq: 196 },
  { emoji: '🦆', name: '오리', sound: '꽥꽥', color: '#4FC3F7', freq: 587 },
  { emoji: '🐔', name: '닭', sound: '꼬끼오', color: '#FF8A65', freq: 698 },
  { emoji: '🐑', name: '양', sound: '매에', color: '#E0E0E0', freq: 440 },
  { emoji: '🐴', name: '말', sound: '히히힝', color: '#BCAAA4', freq: 330 },
  { emoji: '🐤', name: '병아리', sound: '삐약삐약', color: '#FFF176', freq: 880 },
  { emoji: '🐘', name: '코끼리', sound: '뿌우', color: '#B0BEC5', freq: 165 },
]

// 받침 유무에 따라 조사 고르기: 강아지는/닭은, 강아지예요/닭이에요
const hasBatchim = (word: string) => {
  const code = word.charCodeAt(word.length - 1) - 0xac00
  return code >= 0 && code <= 11171 && code % 28 !== 0
}
export const topic = (w: string) => w + (hasBatchim(w) ? '은' : '는')
export const isIt = (w: string) => w + (hasBatchim(w) ? '이에요' : '예요')
