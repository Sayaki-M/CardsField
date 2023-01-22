const PIECESIZE = 100;
const XSPACE = 120;
const YSPACE = XSPACE;
const XCENTER = SCREEN_WIDTH / 2;
const XRIGHT = XCENTER + XSPACE;
const XLEFT = XCENTER - XSPACE;
const YTOP = 240;
const YMTOP = YTOP + YSPACE;
const YMBOTTOM = YMTOP + YSPACE;
const YBOTTOM = YMBOTTOM + YSPACE;
const PIECEPLACE = {
  1: { x: XLEFT, y: YTOP },
  2: { x: XCENTER, y: YTOP },
  3: { x: XRIGHT, y: YTOP },
  4: { x: XLEFT, y: YMTOP },
  5: { x: XCENTER, y: YMTOP },
  6: { x: XRIGHT, y: YMTOP },
  7: { x: XLEFT, y: YMBOTTOM },
  8: { x: XCENTER, y: YMBOTTOM },
  9: { x: XRIGHT, y: YMBOTTOM },
  C: { x: XLEFT, y: YBOTTOM },
  0: { x: XCENTER, y: YBOTTOM },
  AC: { x: XRIGHT, y: YBOTTOM },
};

//EnterRoomSceneクラスを定義
phina.define("EnterRoomScene", {
  superClass: "BaseScene",
  init: function (param) {
    this.superInit(param);
    this.group = DisplayElement().addChildTo(this);
    this.myId = param.myId;
    this.backgroundColor = "pink";
    // ラベルを生成
    this.label = Label({
      x: XCENTER,
      y: YTOP - YSPACE,
      fontSize: 80,
    }).addChildTo(this);
    this.bar = Placebar().addChildTo(this.group);
    for (let i = 0; i <= 9; i++) {
      this.createNumButton(i);
    }
    this.createCButton();
    this.entering = "";
    this.goButton = GoButton().addChildTo(this.group);
    let self = this;
    this.goButton.onpointend = function () {
      socket.emit("memjoin", { room: parseInt(self.entering) });
      self.goButton.setInteractive(false);
    };
    let quitbutton = QuitButton().addChildTo(this.group);
    quitbutton.x = 560;
    quitbutton.y = 60;
    quitbutton.onpointstart = function () {
      self.exit({
        nextLabel: "TitleScene",
      });
    };
    this.askJoin();
    this.setText();
  },
  askJoin: function () {
    let self = this;
    socket.on("memroom", function (message) {
      if (!message.room) {
        alert("部屋がないよ");
        self.goButton.setInteractive(true);
      } else {
        self.exit({
          nextLabel: "MainScene",
          roomId: parseInt(self.entering),
          player: self.bar.valnum + 1,
          myId: self.myId,
        });
      }
    });
  },
  createNumButton: function (i) {
    let self = this;
    let num = NumberButton({
      x: PIECEPLACE[i].x,
      y: PIECEPLACE[i].y,
      text: i + "",
    }).addChildTo(this.group);
    num.onpointend = function () {
      self.enteringSpace(num.text);
    };
  },
  createCButton: function () {
    let self = this;
    this.clearButton = NumberButton({
      x: PIECEPLACE.C.x,
      y: PIECEPLACE.C.y,
      text: "C",
    }).addChildTo(this.group);
    this.clearButton.onpointend = function () {
      if (self.entering.length >= 1) {
        self.entering = self.entering.slice(0, self.entering.length - 1);
        self.setText();
      }
    };
    this.clearAllButton = NumberButton({
      x: PIECEPLACE.AC.x,
      y: PIECEPLACE.AC.y,
      text: "AC",
    }).addChildTo(this.group);
    this.clearAllButton.onpointend = function () {
      self.ClearAll();
    };
  },
  enteringSpace: function (text) {
    if (this.entering.length < KETA - 1) {
      this.entering += text;
    } else {
      this.entering = this.entering.slice(0, KETA - 1) + text;
    }
    this.setText();
  },
  setText: function () {
    this.label.text =
      "id:" + (this.entering + Array(KETA + 1).join("-")).slice(0, KETA);
    if (this.entering.length == KETA) {
      this.goButton.activate();
      this.goButton.fill = "blue";
    } else {
      this.goButton.inactivate();
    }
  },
  ClearAll: function () {
    this.entering = "";
    this.setText();
  },
});
