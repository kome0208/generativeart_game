//＜小話＞何を主役にしようか考えた時に生き物や機械は海の中に入るのは難しいと思い、レジ袋にしたという経緯があります。レジ袋は海で数百年残るそうです。たぶん、天国にもプラスチックごみが溢れかえり環境問題になっていることでしょう
import React, { useState } from "react"; 
import MyButton from './components/button';
import BackgroundSketch from './components/BackgroundSketch';

function App() {
  const [screen, setScreen] = useState("home");
  const [screenChangeCount, setScreenChangeCount] = useState(0);

  const stages = [
    { id: "Heaven1", name: "天国１" },
    { id: "Sea1", name: "海１" },
    { id: "Geometry1", name: "幾何１" },
    { id: "Clown1", name: "狂気１" },
    { id: "Geometry2", name: "幾何２" },
    { id: "Sea2", name: "海２" },
    { id: "Clown2", name: "狂気２" },
    { id: "Heaven2", name: "天国２" },
  ];

  const changeScreen = (newScreen) => {
    setScreen(newScreen);
    setScreenChangeCount((count) => count + 1);
  };

  return (
    <div className="app">
      <BackgroundSketch changeCount={screenChangeCount} />

      {screen === "home" && (
        <div>
          <h1>A ridiculously vast world and plastic bags</h1>
          <MyButton onClick={() => changeScreen("howto")}>遊び方</MyButton>
          <MyButton onClick={() => changeScreen("stageSelect")}>ステージ選択</MyButton>
        </div>
      )}

      {screen === "howto" && (
        <div>
          <h2>遊び方</h2>
          <p>ジェネラティブアート × ゲーム！！</p>
          <p>レジ袋を操作し、上から降ってくるゴミから逃げてください</p>
          <p>PCの方向キーを左右に操作し、レジ袋を操作します。動けるレーンは赤線で区切られた4レーンです</p>
          <p>30秒間耐え切ればゲームクリアです</p>
          <p>画面左端にホーム画面にもどるボタンがあります。同じコースのリトライならF5キーのリロードの方が速いです</p>
          <MyButton onClick={() => changeScreen("home")}>ホームに戻る</MyButton>
          <MyButton onClick={() => changeScreen("stageSelect")}>ステージ選択へ</MyButton>
        </div>
      )}

      {screen === "stageSelect" && (
        <div>
          <h2>ステージ選択</h2>
          <p>ステージのシリーズごとにゴミの速さや弾幕の密度が違います。試してからのお楽しみ！</p>
          {Array.from({ length: Math.ceil(stages.length / 4) }).map((_, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex', marginBottom: '8px' }}>
              {stages
                .slice(rowIndex * 4, rowIndex * 4 + 4)
                .map((stage) => (
                  <a href={`/${stage.id}.html`} key={stage.id} style={{ marginRight: '8px' }}>
                    <MyButton>{stage.name}</MyButton>
                  </a>
                ))}
            </div>
          ))}
          <div>
            <MyButton onClick={() => changeScreen("home")}>ホームに戻る</MyButton>
            <MyButton onClick={() => changeScreen("howto")}>遊び方へ</MyButton>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
