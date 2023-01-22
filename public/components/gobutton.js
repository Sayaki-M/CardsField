//goボタンクラス
phina.define("GoButton", {
  superClass: "Button",
  init: function () {
    this.superInit({
      x: SCREEN_WIDTH / 2,
      y: 840,
      text: "Go",
      fill: "gray",
      fontColor: "white",
    });
    this.setInteractive(false);
  },
  inactivate: function () {
    this.setInteractive(false);
    this.fill = "gray";
  },
  activate: function () {
    this.setInteractive(true);
    this.fill = "blue";
  },
});
