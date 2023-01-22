//位置バークラス
phina.define("Placebar", {
  superClass: "RectangleShape",
  init: function (values = ["左", "対面", "右"], y = 720) {
    this.superInit({
      width: 360,
      height: 80,
      fill: "transparent",
      stroke: 0,
      x: SCREEN_WIDTH / 2,
      y: y,
    });
    this.valnum = 1;
    this.group = DisplayElement().addChildTo(this);
    this.values = values;
    this.value = Label({
      text: this.values[this.valnum],
      x: 0,
      fontSize: 40,
    }).addChildTo(this.group);
    this.smaller = TriangleShape({
      x: -80,
      y: 0,
      radius: 20,
      rotation: 30,
      fill: "blue",
    }).addChildTo(this.group);
    this.smaller.setInteractive(true);
    var self = this;
    this.smaller.onpointstart = function () {
      switch (self.valnum) {
        case 2:
          self.valnum -= 1;
          self.larger.show();
          break;
        case 1:
          self.valnum -= 1;
          self.smaller.hide();
          break;
        default:
          break;
      }
      self.value.text = self.values[self.valnum];
    };
    this.larger = TriangleShape({
      x: 80,
      y: 0,
      radius: 20,
      rotation: -30,
      fill: "blue",
    }).addChildTo(this.group);
    this.larger.setInteractive(true);
    this.larger.onpointstart = function () {
      switch (self.valnum) {
        case 0:
          self.valnum += 1;
          self.smaller.show();
          break;
        case 1:
          self.valnum += 1;
          self.larger.hide();
          break;
        default:
          break;
      }
      self.value.text = self.values[self.valnum];
    };
  },
});
//番号ボタンクラス
phina.define("NumberButton", {
  superClass: "Button",
  init: function (options) {
    options = (options || {}).$safe({
      width: PIECESIZE,
      height: PIECESIZE,
      fill: "green",
      fontSize: 50,
    });
    this.superInit(options);
    this.setInteractive(true);
  },
});
