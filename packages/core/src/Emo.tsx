// 3D 그림 이모지 (Microsoft Fluent Emoji 3D, MIT): 기기마다 다른 이모지 글꼴 대신 앱에 넣은 그림으로 보여 줌
// 앱의 public/emoji/ 에 파일, src/emoji-files.json 에 { 이모지: 파일 } 목록 (npm run emoji -- <앱> 이 만듦)
// 목록에 없으면 그냥 글자 이모지로 보임 → 그림을 다 넣지 않아도 동작
let files: Record<string, string> = {}
export function setEmojiFiles(f: Record<string, string> | undefined) {
  files = f ?? {}
}
export const hasEmoji = (e: string) => !!files[e]
export const usesEmojiFiles = () => Object.keys(files).length > 0

// 글자 크기(1em)에 맞춰 그림을 그림 → 이모지 글자 자리에 그대로 바꿔 넣으면 됨
export function Emo({ e, className }: { e: string; className?: string }) {
  const f = files[e]
  if (!f) return <>{e}</>
  return <img className={'emo' + (className ? ' ' + className : '')} src={`emoji/${f}`} alt={e} draggable={false} />
}
