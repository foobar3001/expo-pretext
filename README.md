# @foobar3001/expo-pretext

React Native / Expo 向けのテキストレイアウト補助ライブラリです。  
Android 上での CJK (Chinese/Japanese/Korean) の扱いを改善したい用途を主目的に作成しています。

## Features

- CJK を含む複数言語テキストの計測・レイアウト補助
- `useTextHeight` による描画前の高さ予測
- FlashList 連携用の `useFlashListHeights`
- Expo モジュール経由の Native 計測（Web はフォールバック実装）

## Install (GitHub Packages)

このパッケージは GitHub Packages で配布しています。

1. プロジェクトの `.npmrc` にスコープ設定を追加

```ini
@foobar3001:registry=https://npm.pkg.github.com
```

2. 認証トークンを設定（`read:packages` 権限が必要）

```ini
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

3. インストール

```sh
npm i @foobar3001/expo-pretext
```

## Quick Start

```tsx
import { Text, View } from 'react-native'
import { useTextHeight } from '@foobar3001/expo-pretext'

type Props = {
  text: string
  maxWidth: number
}

export function MessageBubble({ text, maxWidth }: Props) {
  const height = useTextHeight(
    text,
    { fontFamily: 'System', fontSize: 16, lineHeight: 24 },
    maxWidth
  )

  return (
    <View style={{ width: maxWidth, minHeight: height }}>
      <Text>{text}</Text>
    </View>
  )
}
```

## Notes

- 推奨環境: Expo SDK 52+

## License

MIT
