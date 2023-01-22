// メイン処理
phina.main(function () {
  // アプリケーション生成
  var app = GameApp({
    startLabel: "TitleScene",
    // シーンのリストを引数で渡す
    scenes: [
      {
        className: "TitleScene",
        label: "TitleScene",
      },
      {
        className: "EnterRoomScene",
        label: "EnterRoomScene",
        nextLabel: "MainScene",
      },
      {
        className: "MainScene",
        label: "MainScene",
      },
    ],
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    assets: ASSETS,
  });
  // アプリケーション実行
  app.run();
});
