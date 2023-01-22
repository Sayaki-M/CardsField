const CARDS = {
  0: { suit: "ス", num: "A", color: "black" },
  1: { suit: "ス", num: "2", color: "black" },
  2: { suit: "ス", num: "3", color: "black" },
  3: { suit: "ス", num: "4", color: "black" },
  4: { suit: "ス", num: "5", color: "black" },
  5: { suit: "ス", num: "6", color: "black" },
  6: { suit: "ス", num: "7", color: "black" },
  7: { suit: "ス", num: "8", color: "black" },
  8: { suit: "ス", num: "9", color: "black" },
  9: { suit: "ス", num: "10", color: "black" },
  10: { suit: "ス", num: "J", color: "black" },
  11: { suit: "ス", num: "Q", color: "black" },
  12: { suit: "ス", num: "K", color: "black" },
  13: { suit: "ハ", num: "A", color: "crimson" },
  14: { suit: "ハ", num: "2", color: "crimson" },
  15: { suit: "ハ", num: "3", color: "crimson" },
  16: { suit: "ハ", num: "4", color: "crimson" },
  17: { suit: "ハ", num: "5", color: "crimson" },
  18: { suit: "ハ", num: "6", color: "crimson" },
  19: { suit: "ハ", num: "7", color: "crimson" },
  20: { suit: "ハ", num: "8", color: "crimson" },
  21: { suit: "ハ", num: "9", color: "crimson" },
  22: { suit: "ハ", num: "10", color: "crimson" },
  23: { suit: "ハ", num: "J", color: "crimson" },
  24: { suit: "ハ", num: "Q", color: "crimson" },
  25: { suit: "ハ", num: "K", color: "crimson" },
  26: { suit: "ダ", num: "A", color: "crimson" },
  27: { suit: "ダ", num: "2", color: "crimson" },
  28: { suit: "ダ", num: "3", color: "crimson" },
  29: { suit: "ダ", num: "4", color: "crimson" },
  30: { suit: "ダ", num: "5", color: "crimson" },
  31: { suit: "ダ", num: "6", color: "crimson" },
  32: { suit: "ダ", num: "7", color: "crimson" },
  33: { suit: "ダ", num: "8", color: "crimson" },
  34: { suit: "ダ", num: "9", color: "crimson" },
  35: { suit: "ダ", num: "10", color: "crimson" },
  36: { suit: "ダ", num: "J", color: "crimson" },
  37: { suit: "ダ", num: "Q", color: "crimson" },
  38: { suit: "ダ", num: "K", color: "crimson" },
  39: { suit: "ク", num: "A", color: "black" },
  40: { suit: "ク", num: "2", color: "black" },
  41: { suit: "ク", num: "3", color: "black" },
  42: { suit: "ク", num: "4", color: "black" },
  43: { suit: "ク", num: "5", color: "black" },
  44: { suit: "ク", num: "6", color: "black" },
  45: { suit: "ク", num: "7", color: "black" },
  46: { suit: "ク", num: "8", color: "black" },
  47: { suit: "ク", num: "9", color: "black" },
  48: { suit: "ク", num: "10", color: "black" },
  49: { suit: "ク", num: "J", color: "black" },
  50: { suit: "ク", num: "Q", color: "black" },
  51: { suit: "ク", num: "K", color: "black" },
  52: { suit: "バ", num: "バ", color: "black" },
  53: { suit: "バ", num: "バ", color: "crimson" },
};

var CARD_WIDTH = 56;
var CARD_HEIGHT = 84;

var GRAD = Canvas.createLinearGradient(
  CARD_WIDTH / 2,
  -CARD_HEIGHT / 2,
  -CARD_WIDTH / 2,
  CARD_HEIGHT / 2
);

GRAD.addColorStop(0, "green");
GRAD.addColorStop(0.5, "yellowgreen");
GRAD.addColorStop(1, "green");

/*カードクラス*/
phina.define("Card", {
  //クラス継承
  superClass: "Rectangle",
  //初期化
  init: function (x, y, id, roomId, player, myId) {
    this.superInit();
    this.group = DisplayElement().addChildTo(this);
    this.active = false;
    this.selected = false;
    this.roomId = roomId;
    this.myId = myId;
    this.player = player;
    this.id = id;
    this.x = x;
    this.y = y;
    this.dl = 0;
    this.group.suit = Label({
      text: CARDS[id].suit,
      y: -CARD_HEIGHT / 4,
      fill: CARDS[id].color,
    }).addChildTo(this.group);
    this.group.number = Label({
      text: CARDS[id].num,
      y: CARD_HEIGHT / 4,
      fill: CARDS[id].color,
    }).addChildTo(this.group);
    this.setInteractive(true);
    this.front = false; //表：true
    this.fill = GRAD;
    this.group.hide();
  },
  update: function () {
    if (this.active) {
      this.stroke = "red";
      this.strokeWidth = 8;
    } else {
      this.stroke = "purple";
      this.strokeWidth = 4;
    }
  },
  //クリック中の動き
  onpointstart: function (e) {
    if (e.pointer.y > OPPONENT_HEIGHT) {
      this.selected = true;
    }
  },
  onpointmove: function (e) {
    if (this.active) {
      if (e.pointer.x < CARD_WIDTH / 2) {
        this.x = CARD_WIDTH / 2;
      } else if (e.pointer.x > SCREEN_WIDTH - CARD_WIDTH / 2) {
        this.x = SCREEN_WIDTH - CARD_WIDTH / 2;
      } else {
        this.x = e.pointer.x;
      }
      if (e.pointer.y < OPPONENT_HEIGHT + CARD_HEIGHT / 2) {
        this.y = OPPONENT_HEIGHT + CARD_HEIGHT / 2;
      } else if (e.pointer.y > SCREEN_HEIGHT - CARD_HEIGHT / 2) {
        this.y = SCREEN_HEIGHT - CARD_HEIGHT / 2;
      } else {
        this.y = e.pointer.y;
      }
    }
    this.dl += e.pointer.x * e.pointer.x + e.pointer.y * e.pointer.y;
    this.sendCardData();
  },
  //クリック終了時の動き
  onpointend: function () {
    if (this.dl > 0) {
      this.dl = 0;
      this.active = false;
      this.sendCardData();
    }
    this.selected = false;
  },
  turntofront: function () {
    this.front = true;
    this.group.show();
    this.fill = "white";
  },
  turntoback: function () {
    this.front = false;
    this.group.hide();
    this.fill = GRAD;
  },
  //反転させる
  turn: function () {
    if (this.front) {
      this.turntoback();
    } else {
      this.turntofront();
    }
    this.sendCardData();
  },
  sendCardData: function () {
    var x = this.x - FIELD_CENTER_X;
    var y = this.y - FIELD_CENTER_Y;
    switch (this.player) {
      case 1:
        socket.emit("card", {
          room: this.roomId,
          id: this.id,
          x: -y,
          y: x,
          front: this.front,
          myId: this.myId,
        });
        return false;
        break;
      case 2:
        socket.emit("card", {
          room: this.roomId,
          id: this.id,
          x: -x,
          y: -y,
          front: this.front,
          myId: this.myId,
        });
        return false;
        break;
      case 3:
        socket.emit("card", {
          room: this.roomId,
          id: this.id,
          x: y,
          y: -x,
          front: this.front,
          myId: this.myId,
        });
        return false;
        break;
      default:
        socket.emit("card", {
          room: this.roomId,
          id: this.id,
          x: x,
          y: y,
          front: this.front,
          myId: this.myId,
        });
        return false;
        break;
    }
  },
});
//カードクラスのもととなる長方形クラス
phina.define("Rectangle", {
  superClass: "RectangleShape",
  init: function (x, y) {
    this.superInit({
      fill: GRAD,
      stroke: "purple",
      strokeWidth: 4,
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      cornerRadius: 10,
      x: x,
      y: y,
    });
  },
});
