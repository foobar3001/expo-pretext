// example/components/demos/HeadlinesFeedJa.tsx
//
// Plain-text FlashList v2 demo (Japanese text version)
//
// 10,000 Japanese headlines with varying line counts. `getHeight(item)`
// returns the exact measured text height; we pad it and set an explicit
// height on the wrapping View so FlashList v2 can skip the measurement frame.

import { useCallback, memo } from 'react'
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { useFlashListHeights } from 'expo-pretext'

const PAD_X = 16
const PAD_Y = 12
const GAP = 8

const TEXT_STYLE = {
  fontFamily: 'System',
  fontSize: 15,
  lineHeight: 22,
}

const SEEDS: string[] = [
  '仮想化リストは、最初の描画で各行がぴたりと収まると体感が一段上がる。揺れも再レイアウトもちらつきもない。',
  '高さが正確なら、FlashList は計測フレームを省略できる。',
  'チャットアプリはおしゃれなスクロールビューではない。高さがばらばらの深いリストだ。',
  'ネイティブ計測は真実で、JS フォールバックは安全網だ。',
  '短い文。',
  '高さ予測は描画ではなく算術だ。だから 1 アイテムあたりサブミリ秒でも正確に出せる。',
  '仮想化リストでの小さな誤差は積み重なって、説明しづらい違和感としてスクロールに表れる。',
  '良いタイポグラフィは気づかれず、悪いタイポグラフィは会議になる。',
  '次の語が箱の端を超えるなら改行する。基本はそれだけで、残りは例外処理だ。',
  'FlashList v2 は推定サイズを捨てたが、事前計測でさらに助ける余地はある。',
  'バックグラウンドでキャッシュを温めるのは安い。やらない時だけユーザーに気づかれる。',
  '複雑さは計測境界に閉じ込める。リスト層は数字だけ受け取ればよい。',
  'エディタは単語を知らず、書記素クラスタの終端しか知らない。その差が効いてくる。',
  '1 万件のメッセージをバッチ API で数ミリ秒計測し、キャッシュして、簡単そうに見せる。',
  'ボトルネックは描画より再フローにある。分離すると一気に速くなる。',
  '不正確な高さの仮想化リストは、スクロールバーに嘘をつくリストだ。',
  '性能検証ではプレーンテキストが最適だ。Markdown は別問題になる。',
  'レイアウト関数は冷たい算術の塊だ。余計な割り当てを避けて一つの責務に集中する。',
  'Hermes にはまだ Intl.Segmenter がない。大半はスプレッド演算子で足りるが、最後は ZWJ 絵文字だ。',
  '毎リリースで複数幅と複数スクリプトの精度テストを回し、1 ケースでも崩れたら止める。',
  'キャッシュは同じ文字列が再計測される前提への賭けで、チャットではほぼ常に当たる。',
  'スクロールのたびに再計測する行は、言い訳付きのバグだ。',
  'iOS は TextKit、Android は TextPaint、Web は Canvas。契約は同じ 4 つの float に落ちる。',
  '予測: 384.0、実測: 384.0、差分: 0.0。全行、全幅、全スクリプトでこれを狙う。',
  '正解はたいてい、フラットな配列と for ループにある。',
  '高さは意見ではなく結果だ。',
]

type Item = {
  id: string
  text: string
}

const TOTAL = 10_000

function buildItems(): Item[] {
  const out: Item[] = new Array(TOTAL)
  for (let i = 0; i < TOTAL; i++) {
    const seed = SEEDS[i % SEEDS.length]!
    out[i] = { id: String(i), text: `#${i + 1}。${seed}` }
  }
  return out
}

const ITEMS = buildItems()

type RowProps = { item: Item; height: number; width: number }

const Row = memo(function Row({ item, height, width }: RowProps) {
  return (
    <View style={[s.rowWrap, { height }]}>
      <View style={[s.card, { width: width - 32 }]}>
        <Text style={s.rowText}>{item.text}</Text>
      </View>
    </View>
  )
})

export function HeadlinesFeedJaDemo() {
  const { width } = useWindowDimensions()
  const textMaxWidth = width - 32 - PAD_X * 2

  const { getHeight } = useFlashListHeights(
    ITEMS,
    (item) => item.text,
    TEXT_STYLE,
    textMaxWidth,
  )

  const renderItem = useCallback(
    ({ item }: { item: Item }) => {
      const height = getHeight(item) + PAD_Y * 2 + GAP
      return <Row item={item} height={height} width={width} />
    },
    [getHeight, width],
  )

  return (
    <View style={s.root}>
      <View style={s.banner}>
        <Text style={s.bannerText}>
          {TOTAL.toLocaleString()} 行の日本語テキスト · `getHeight(item)` · 行ごとの厳密な高さ
        </Text>
      </View>
      <FlashList
        data={ITEMS}
        renderItem={renderItem}
        keyExtractor={(m) => m.id}
      />
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0a0c' },
  banner: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#121218',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,211,105,0.15)',
  },
  bannerText: {
    fontFamily: 'System',
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
  },
  rowWrap: {
    paddingHorizontal: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#121218',
    borderRadius: 12,
    paddingHorizontal: PAD_X,
    paddingVertical: PAD_Y,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  rowText: {
    fontFamily: TEXT_STYLE.fontFamily,
    fontSize: TEXT_STYLE.fontSize,
    lineHeight: TEXT_STYLE.lineHeight,
    color: 'rgba(255,255,255,0.92)',
  },
})
