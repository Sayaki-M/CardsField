// MainScene クラスを定義
phina.define("MainScene", {
  superClass: "DisplayScene",
  init: function (param) {
    this.superInit();
    // 背景色を指定
    this.backgroundColor = "#05fff2";
    this.group = DisplayElement().addChildTo(this);
    this.roomId = param.roomId !== undefined ? param.roomId : "err!";
    this.myId = param.myId;
    this.player = param.player; //0:親,1:左,2:対面,3:右
    var playerBG = RectangleShape({
      x: this.gridX.center(),
      y: SCREEN_HEIGHT - PLAYER_HEIGHT / 2,
      fill: "green",
      width: SCREEN_WIDTH,
      height: PLAYER_HEIGHT,
      strokeWidth: 0,
    }).addChildTo(this.group);
    this.cardgroup = DisplayElement().addChildTo(this.group);
    var numBG = RectangleShape({
      x: this.gridX.center(),
      y: OPPONENT_HEIGHT / 2,
      fill: "yellow",
      width: SCREEN_WIDTH,
      height: OPPONENT_HEIGHT,
      strokeWidth: 0,
    }).addChildTo(this.group);
    this.roomNum = Label({
      x: 100,
      y: OPPONENT_HEIGHT / 2,
      fontSize: 40,
    }).addChildTo(this.group);
    this.bg = Sprite("logo").addChildTo(this.group);
    this.bg.x = 310;
    this.bg.y = OPPONENT_HEIGHT / 2;
    this.bg.scaleX -= 0.65;
    this.bg.scaleY -= 0.65;
    this.setRoomNumber();
    if (this.player == 0) {
      this.setDeck();
      this.sendAllCardData();
      this.receiveCardData();
    } else {
      this.reqAllCardData();
      this.receiveAllCardData();
    }
    this.quitbutton = Button({
      x: 580,
      y: 60,
      width: 80,
      height: 80,
      text: "Quit",
      fill: "red",
      fontColor: "white",
    }).addChildTo(this.group);
    this.quitbutton.alpha = 0.8;
    var self = this;
    this.quitbutton.onpointstart = function () {
      var quitpopup = QuitPopup().addChildTo(self.group);
      quitpopup.quitbutton.onpointstart = function () {
        socket.emit("quit", { room: self.roomId });
        self.exit({
          nextLabel: "TitleScene",
        });
      };
    };
  },
  reqAllCardData: function () {
    socket.emit("reqcard", { room: this.roomId });
    return false;
  },
  sendAllCardData: function () {
    var self = this;
    socket.on("reqcard", function () {
      var cards = [];
      self.cardgroup.children.forEach(function (nya) {
        cards.push({
          room: nya.roomId,
          id: nya.id,
          x: nya.x - FIELD_CENTER_X,
          y: nya.y - FIELD_CENTER_Y,
          front: nya.front,
        });
      });
      socket.emit("initcard", { room: self.roomId, cards: cards });
    });
  },
  receiveAllCardData: function () {
    var self = this;
    socket.once("initcard", function (datas) {
      datas.cards.forEach(function (nya) {
        var card = self.showCard(FIELD_CENTER_X, FIELD_CENTER_Y, nya.id);
        if (nya.front) {
          card.turntofront();
        } else {
          card.turntoback();
        }
        switch (self.player) {
          case 1:
            card.x = FIELD_CENTER_X + nya.y;
            card.y = FIELD_CENTER_Y - nya.x;
            break;
          case 2:
            card.x = FIELD_CENTER_X - nya.x;
            card.y = FIELD_CENTER_Y - nya.y;
            break;
          case 3:
            card.x = FIELD_CENTER_X - nya.y;
            card.y = FIELD_CENTER_Y + nya.x;
            break;
          default:
            card.x = FIELD_CENTER_X + nya.x;
            card.y = FIELD_CENTER_Y + nya.y;
            break;
        }
      });
      self.receiveCardData();
      return false;
    });
  },
  setRoomNumber: function () {
    this.roomNum.text =
      "id:" + (Array(KETA).join("0") + this.roomId).slice(-KETA);
  },
  onpointstart: function () {
    var self = this;
    self.cardgroup.children.forEach(function (nya, i) {
      self.cardgroup.children.forEach(function (targ, j) {
        if (nya.selected && targ.selected && j < i) {
          targ.selected = false;
        }
      });
    });
    self.cardgroup.children.forEach(function (nya, i) {
      if (nya.selected) {
        if (nya.active) {
          nya.turn();
          nya.active = false;
        } else {
          nya.active = true;
        }
      } else {
        nya.active = false;
      }
    });
  },
  setDeck: function () {
    var self = this;
    cards = [...Array(54).keys()];
    for (var i = cards.length - 1; i > 0; i--) {
      var r = Math.floor(Math.random() * (i + 1));
      var tmp = cards[i];
      cards[i] = cards[r];
      cards[r] = tmp;
    }
    self.showCard(
      FIELD_CENTER_X + 5,
      FIELD_CENTER_Y + 5,
      cards[cards.length - 1]
    );
    for (var i = cards.length - 2; i >= 0; i--) {
      self.showCard(FIELD_CENTER_X, FIELD_CENTER_Y, cards[i]);
    }
  },
  //カードを表示する
  showCard: function (x, y, id) {
    var card = Card(x, y, id, this.roomId, this.player, this.myId).addChildTo(
      this.cardgroup
    );
    return card;
  },
  //目的のカードを探す
  findCard: function (id) {
    var targ;
    var find = false;
    var self = this;
    this.cardgroup.children.forEach(function (card) {
      if (card.id == id) {
        targ = card;
        find = true;
      }
    });
    if (find) {
      return targ;
    } else {
      card = self.showCard(FIELD_CENTER_X, FIELD_CENTER_Y, id);
      return card;
    }
  },
  //カードを動かす
  moveCard: function (x, y, id) {
    var targ = this.findCard(id);
    targ.x = x;
    targ.y = y;
  },
  receiveCardData: function () {
    var self = this;
    socket.on("my_card", function (datas) {
      if (datas.myId != self.myId) {
        var card = self.findCard(datas.id);
        if (datas.front) {
          card.turntofront();
        } else {
          card.turntoback();
        }
        switch (self.player) {
          case 1:
            card.x = FIELD_CENTER_X + datas.y;
            card.y = FIELD_CENTER_Y - datas.x;
            break;
          case 2:
            card.x = FIELD_CENTER_X - datas.x;
            card.y = FIELD_CENTER_Y - datas.y;
            break;
          case 3:
            card.x = FIELD_CENTER_X - datas.y;
            card.y = FIELD_CENTER_Y + datas.x;
            break;
          default:
            card.x = FIELD_CENTER_X + datas.x;
            card.y = FIELD_CENTER_Y + datas.y;
            break;
        }
      }
    });
  },
});
