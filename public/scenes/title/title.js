//TitleSceneクラスを定義
phina.define("TitleScene", {
  superClass: "BaseScene",
  init: function () {
    this.superInit();
    this.backgroundColor = "lightblue";
    this.logo = Sprite("logo")
      .addChildTo(this.group)
      .setPosition(this.gridX.center(), (this.gridY.center() * 5) / 6)
      .setScale(0.8, 0.8);

    this.group = DisplayElement().addChildTo(this);

    let makeRoomButton = Button({
      text: "makeroom",
      fill: "blue",
      fontColor: "white",
    })
      .addChildTo(this.group)
      .setPosition(this.gridX.center() / 2, (this.gridY.center() * 3) / 2);
    let self = this;
    makeRoomButton.onpointend = function () {
      makeRoomButton.setInteractive(false);
      self.joinRoom();
      socket.emit("hostjoin");
    };
    let enterRoomButton = Button({
      x: (this.gridX.center() * 3) / 2,
      y: (this.gridY.center() * 3) / 2,
      text: "enterroom",
      fill: "blue",
      fontColor: "white",
    }).addChildTo(this.group);
    enterRoomButton.onpointend = function () {
      self.exit({
        nextLabel: "EnterRoomScene",
        myId: self.myId,
      });
    };
    this.askmyid();
  },
  askmyid: function () {
    let self = this;
    socket.emit("answermyid");
    socket.once("myId", function (datas) {
      self.myId = datas.myId;
    });
    return false;
  },
  joinRoom: function () {
    let self = this;
    socket.once("hostroom", function (message) {
      self.exit({
        nextLabel: "MainScene",
        roomId: message.room,
        player: 0,
        myId: self.myId,
      });
    });
    return false;
  },
});
