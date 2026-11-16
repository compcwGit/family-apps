// 도장 그림: 이모지, 없으면 기본 "참 잘했어요" 도장. 크기는 부모 요소의 font-size를 따름
export function StampIcon({ emoji }: { emoji: string }) {
  return emoji ? <span className="icon-emoji">{emoji}</span> : <span className="good-stamp">참<br />잘했어요</span>
}
