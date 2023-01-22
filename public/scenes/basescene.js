//Sceneの基本デザインを定義
phina.define("BaseScene", {
  superClass: "DisplayScene",
  init: function () {
    this.superInit();
    this.group = DisplayElement().addChildTo(this);
  },
});
