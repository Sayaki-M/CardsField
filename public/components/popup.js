//やめるポップアップ
phina.define("QuitPopup", {
  superClass: "BasePopup",
  init: function () {
    this.superInit({ width: 500, height: 300 });
    this.label = Label({
      text: "Wanna quit?",
      fill: "black",
      y: -20,
      fontSize: 50,
    }).addChildTo(this.group);
    var self = this;
    this.staybutton = Button({
      x: (-1 * self.width) / 4,
      y: 80,
      width: 120,
      height: 80,
      text: "Stay",
      fill: "gray",
      fontColor: "white",
    }).addChildTo(this);
    this.quitbutton = Button({
      x: self.width / 4,
      y: 80,
      width: 120,
      height: 80,
      text: "Quit",
      fill: "red",
      fontColor: "white",
    }).addChildTo(this);
    this.staybutton.onpointstart = function () {
      self.remove();
    };
  },
});
//ポップアップのもと
phina.define("BasePopup", {
  superClass: "RectangleShape",
  init: function (options) {
    this.superInit(options);
    this.fill = "white";
    this.strokeWidth = 10;
    this.stroke = "red";
    this.x = SCREEN_WIDTH / 2;
    this.y = SCREEN_HEIGHT / 2;
    (this.cornerRadius = 10), (this.group = DisplayElement().addChildTo(this));
    var quit = QuitButton().addChildTo(this.group);
    quit.x = this.width * 0.4;
    quit.y = this.height * -0.35;
    var self = this;
    quit.onpointstart = function () {
      self.remove();
    };
  },
});
//ポップアップの右上の×
phina.define("QuitButton", {
  superClass: "CircleShape",
  init: function () {
    this.superInit({
      radius: 30,
      fill: "gray",
      fontColor: "white",
    });
    this.group = DisplayElement().addChildTo(this);
    this.setInteractive(true);
    this.label = Label({
      text: "×",
      fill: "white",
      fontSize: 60,
    }).addChildTo(this.group);
  },
});
