phina.globalize();

//定数
var ASSETS={
  image:{
    gara: "gara.png",
  },
}
var SUITS={
  1:"ス",
  2:"ハ",
  3:"ダ",
  4:"ク",
}
var NUMS={
  1:"A",
  2:"2",
  3:"3",
  4:"4",
  5:"5",
  6:"6",
  7:"7",
  8:"8",
  9:"9",
  10:"10",
  11:"J",
  12:"Q",
  0:"K",
}
var SCREEN_WIDTH=640;
var SCREEN_HEIGHT=960;
var OPPONENT_HEIGHT=120;
var FIELD_HEIGHT=640;
var PLAYER_HEIGHT=SCREEN_HEIGHT-OPPONENT_HEIGHT-FIELD_HEIGHT;//=200
var SIDE_PADDING=110;
var CARD_WIDTH=56;
var CARD_HEIGHT=84;
var GRAD=Canvas.createLinearGradient(CARD_WIDTH/2,-CARD_HEIGHT/2,-CARD_WIDTH/2,CARD_HEIGHT/2);
var SPACE=[100,100];
var PUT_SPACE_F=[SPACE[0]/2,OPPONENT_HEIGHT+FIELD_HEIGHT-SPACE[1]/2];
var PUT_SPACE_P=[SCREEN_WIDTH-SPACE[0]/2,OPPONENT_HEIGHT+FIELD_HEIGHT+SPACE[1]/2];
var SEND_SPACE_F=[SCREEN_WIDTH-SPACE[0]/2,OPPONENT_HEIGHT+FIELD_HEIGHT-SPACE[1]/2];
var SEND_SPACE_P=[SPACE[0]/2,OPPONENT_HEIGHT+FIELD_HEIGHT+SPACE[1]/2];
var TURN_SPACE_F=[SPACE[0]/2,OPPONENT_HEIGHT+SPACE[1]/2];
var TURN_SPACE_P=[SPACE[0]/2,SCREEN_HEIGHT-SPACE[1]/2];
var REMOVE_SPACE_F=[SCREEN_WIDTH-SPACE[0]/2,OPPONENT_HEIGHT+SPACE[1]/2];
GRAD.addColorStop(0,'green');
GRAD.addColorStop(0.5,'yellowgreen');
GRAD.addColorStop(1,'green');

// MainScene クラスを定義
phina.define('MainScene', {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit();
    // 背景色を指定
    this.backgroundColor = 'yellow';
    this.bg=Sprite("gara").addChildTo(this);
    this.bg.origin.set(0,0);
    this.group=DisplayElement().addChildTo(this);
    /*var num = 8;
    var x= (SCREEN_WIDTH-2*SIDE_PADDING-CARD_WIDTH)/num;
    var y=(SCREEN_HEIGHT-PLAYER_HEIGHT-FIELD_HEIGHT/2);
    var cards=[];
    for(var i=0;i<num;i++){
      //cards[i]=Card(SIDE_PADDING+x*i+CARD_WIDTH,y).addChildTo(this.group);
    }*/
    var self=this;
    this.deck=Deck();
    this.player=Player(self);
    this.field=Field();
    /*for(var i=0;i<3;i++){
      this.getCard();
    }*/
    //this.prepare(this.player.cards);
    this.setButtons();
  },
  setButtons:function(){
    //山札をめくるボタン
    var x=PUT_SPACE_F[0]+SPACE[0]/2+CARD_WIDTH/2+5;
    var y=PUT_SPACE_F[1];
    self=this;
    this.getcard=Rectangle(x=x,y=y).addChildTo(this.group);
    this.getcard.text=Label("山\n札").addChildTo(this.getcard);
    this.getcard.setInteractive(true);
    this.getcard.onpointend=function(){
      var cnum=self.getCard();
      var suit=Math.ceil(cnum/13);
      var num =(cnum%13);
      var card=Card(PUT_SPACE_F[0],PUT_SPACE_F[1],num,suit,position="field",front=false).addChildTo(self.group);
      card.onpointstart=function(){
        card.active=true;
        self.group.children.forEach(function(nya,i){
          self.group.children.forEach(function(targ,j){
            if(nya.active&&targ.active&&j<i){
              targ.active=false;
            }
          });
        });
      };
    };
    this.getcard.update=function(){
      if (self.deck.cards[0]==null){
        self.getcard.remove();
      }
    };

  },
  //山札から手札に
  getCard:function(){
    var a=this.deck.giveCard();
    this.player.addCard(a);
    return a;
  },
  //手札を並べる
  prepare: function(cards){
    var x= (SCREEN_WIDTH-2*SIDE_PADDING-CARD_WIDTH)/(cards.length-1);
    var y=(SCREEN_HEIGHT-PLAYER_HEIGHT/2);
    var nya=[];
    for(var i=0;i<cards.length;i++){
      var suit=Math.ceil(cards[i]/13);
      var num =(cards[i]%13);
      nya[i]=Card(SIDE_PADDING+x*i+CARD_WIDTH/2,y,num,suit,position="player",front=true).addChildTo(this.group);
    }
  },

});

//TitleSceneクラスを定義
phina.define('TitleScene',{
  superClass:'DisplayScene',
  init:function(){
    this.superInit();
    this.group=DisplayElement().addChildTo(this);
    this.backgroundColor='lightblue';
    this.label=Label('CardsField').addChildTo(this);
    this.label.x=this.gridX.center();
    this.label.y=this.gridY.center();
    var makeRoomButton=Button({
      x: this.gridX.center()/2,
      y: this.gridY.center()*3/2,
      text: "makeroom",
      fill: 'blue',
      fontColor: 'white',
    }).addChildTo(this.group);
    self=this;
    makeRoomButton.onpointend=function(){
      self.exit('RuleScene');
    };
    var enterRoomButton=Button({
      x: this.gridX.center()*3/2,
      y: this.gridY.center()*3/2,
      text: "enterroom",
      fill: 'blue',
      fontColor: 'white',
    }).addChildTo(this.group);
    self=this;
    enterRoomButton.onpointend=function(){
      self.exit('EnterRoomScene');
    };
  },
});

//RuleSceneクラスを定義
phina.define('RuleScene',{
  superClass:'DisplayScene',
  init:function(){
    this.superInit();
    this.group=DisplayElement().addChildTo(this);
    this.backgroundColor='yellowgreen';
    this.label=Label('Rule').addChildTo(this.group);
    this.label.x=this.gridX.center();
    this.label.y=this.gridY.center();
    var goButton=Button({
      x: this.gridX.center(),
      y: this.gridY.center()*3/2,
      text: "Go",
      fill: 'blue',
      fontColor: 'white',
    }).addChildTo(this.group);
    self=this;
    goButton.onpointend=function(){
      self.exit();
    };
  },
});

//MakeRoomSceneクラスを定義
phina.define('MakeRoomScene',{
  superClass:'DisplayScene',
  init:function(){
    this.superInit();
    this.group=DisplayElement().addChildTo(this);
    this.backgroundColor='lime';
    this.label=Label("MakeRoom").addChildTo(this.group);
    this.roomNumber=Label("12345").addChildTo(this.group);
    this.label.x=this.gridX.center();
    this.label.y=this.gridY.center();
    this.roomNumber.x=this.gridX.center();
    this.roomNumber.y=this.gridY.center()*4/3;
    var goButton=Button({
      x: this.gridX.center(),
      y: this.gridY.center()*3/2,
      text: "Go",
      fill: 'blue',
      fontColor: 'white',
    }).addChildTo(this.group);
    self=this;
    goButton.onpointend=function(){
      self.exit();
    };
    this.setLabel("12345");
  },
  setLabel:function(num){
    this.roomNumber.text="room number:"+num;
  },
});

//EnterRoomSceneクラスを定義
phina.define('EnterRoomScene',{
  superClass:'DisplayScene',
  init:function(){
    this.superInit();
    this.group=DisplayElement().addChildTo(this);
    this.backgroundColor='pink';
    this.label=Label('EnterRoom').addChildTo(this);
    this.label.x=this.gridX.center();
    this.label.y=this.gridY.center();
    var input = document.querySelector('#input');
    input.oninput = function() {
      enterNumber.text.text = input.value;
      enterNumber.text.fontSize=60;
    };

    var enterNumber = RectangleShape({
      x:this.gridX.center(),
      y:this.gridY.center()*4/3,
      height:60,
      width:240,
      stroke:'gray',
      strokeWidth:1,
      fill:'yellow',
    }).addChildTo(this);
    enterNumber.text=Label({
      text:'put your\nroom number',
      fontSize:24,
    }).addChildTo(enterNumber);
    enterNumber.setInteractive(true);
    enterNumber.onpointstart = function() {
      input.focus();
    };
    var goButton=Button({
      x: this.gridX.center(),
      y: this.gridY.center()*3/2,
      text: "Go",
      fill: 'blue',
      fontColor: 'white',
    }).addChildTo(this.group);
    self=this;
    goButton.onpointend=function(){
      self.exit();
    };
  },
});


/*カードクラス*/
phina.define('Card',{
  //クラス継承
  superClass:'Rectangle',
  //初期化
  init: function(x,y,num=2,suit=2,position="field",front=false){
    this.superInit({x:x,y:y,position:position,front:front,num:num,suit:suit});
    this.group=DisplayElement().addChildTo(this);
    this.x=x;
    this.y=y;
    this.active=false;
    this.group.number=Label(NUMS[num]).addChildTo(this.group);
    this.group.number.y=CARD_HEIGHT/4;
    this.group.suit=Label(SUITS[suit]).addChildTo(this.group);
    this.group.suit.y=-CARD_HEIGHT/4;
    this.setInteractive(true);
    this.field=position;
    this.front=front;  //表：true
  },

  update: function(){
    //this.label.x=0;
    //this.label.y=CARD_HEIGHT/4;
    if(this.active){
      this.stroke='red';
      this.strokeWidth=8;
    }else{
      this.stroke='purple';
      this.strokeWidth=4;
    }
    if(this.front){
      this.fill='white';
      this.group.show();
    }else{
      this.fill=GRAD;
      this.group.hide();
    }
  },
  putonf:function(){
    this.moveTo(PUT_SPACE_F[0],PUT_SPACE_F[1]);
    this.field="field";
  },
  putonp:function(){
    this.moveTo(PUT_SPACE_P[0],PUT_SPACE_P[1]);
    this.field="player";
  },
  //クリック開始時の動き
  onpointstart:function(){
    this.active=true;
  },
  //クリック終了時の動き
  onpointend:function(){
    this.active=false;
    if((Math.abs(this.x-SEND_SPACE_F[0])<SPACE[0]/2)&&(Math.abs(this.y-SEND_SPACE_F[1])<SPACE[1]/2)){
      this.putonp();
      this.front=true;
    }
    if((Math.abs(this.x-SEND_SPACE_P[0])<SPACE[0]/2)&&(Math.abs(this.y-SEND_SPACE_P[1])<SPACE[1]/2)){
      this.putonf();
    }
    if((Math.abs(this.x-TURN_SPACE_F[0])<SPACE[0]/2)&&(Math.abs(this.y-TURN_SPACE_F[1])<SPACE[1]/2)){
      this.putonf();
      this.turn();
    }
    if((Math.abs(this.x-TURN_SPACE_P[0])<SPACE[0]/2)&&(Math.abs(this.y-TURN_SPACE_P[1])<SPACE[1]/2)){
      this.putonp();
      this.turn();
    }
    if((Math.abs(this.x-REMOVE_SPACE_F[0])<SPACE[0]/2)&&(Math.abs(this.y-REMOVE_SPACE_F[1])<SPACE[1]/2)){
      this.remove();
    }
  },
  /*以前の仕様
  onpointend:function(){
    this.active=!(this.active);
  },
  */
  //クリック中の動き
  onpointmove:function(e){
    if(this.active){
      if(e.pointer.x<CARD_WIDTH/2){
        this.x=CARD_WIDTH/2;
      }else if(e.pointer.x>SCREEN_WIDTH-CARD_WIDTH/2){
        this.x=SCREEN_WIDTH-CARD_WIDTH/2;
      }else{
        this.x=e.pointer.x;
      }
      if(this.field=="player"){
        if(e.pointer.y<OPPONENT_HEIGHT+FIELD_HEIGHT+CARD_HEIGHT/2){
          this.y=OPPONENT_HEIGHT+FIELD_HEIGHT+CARD_HEIGHT/2;
        }else if(e.pointer.y>SCREEN_HEIGHT-CARD_HEIGHT/2){
          this.y=SCREEN_HEIGHT-CARD_HEIGHT/2;
        }else{
          this.y=e.pointer.y;
        }
      }else if(this.field=="field"){
        if(e.pointer.y<OPPONENT_HEIGHT+CARD_HEIGHT/2){
          this.y=OPPONENT_HEIGHT+CARD_HEIGHT/2;
        }else if(e.pointer.y>OPPONENT_HEIGHT+FIELD_HEIGHT-CARD_HEIGHT/2){
          this.y=OPPONENT_HEIGHT+FIELD_HEIGHT-CARD_HEIGHT/2;
        }else{
          this.y=e.pointer.y
        }

      }
    }
  },
  //裏返す
  turn:function(){
    this.front=!(this.front);
  }
});
//カードクラスのもととなる長方形クラス
phina.define('Rectangle',{
    superClass:'RectangleShape',
    init: function(x,y){
      this.superInit({
        fill: GRAD,
        stroke: 'purple',
        strokeWidth: 4,
        width:CARD_WIDTH,
        height:CARD_HEIGHT,
        cornerRadius: 10,
        x: x,
        y: y,
      });
    },
});
//カード保持者クラス
phina.define("CardHolder",{
  init:function(){
    this.cards=[];
  },
  addCard:function(num){
    this.cards.push(num);
  },
  giveCard:function(){
    var a=this.cards[0];
    this.cards.splice(0,1);
    return a;
  },
  /*remove:function(num){
    this.cards=this.cards.filter(funtion(card){
      return card!==num;
    });
  },*/

});
//山札クラス
phina.define("Deck",{
  superClass:"CardHolder",
  init: function(joker=0){
    this.superInit();
    for(var i=1;i<=(52+joker);i++){
      this.cards[i-1]=i;
    }
    this.shoufle();
  },

  shoufle: function(){
    for(var i=this.cards.length-1;i>0;i--){
      var r=Math.floor(Math.random()*(i+1));
      var tmp = this.cards[i];
      this.cards[i]=this.cards[r];
      this.cards[r]=tmp;
    }
  },

});
//手札クラス
phina.define("Player",{
  superClass:"CardHolder",
  init: function(name="nanasie"){
    this.superInit();
    this.name=name;
  },
});
//場札クラス
phina.define("Field",{
  superClass:"CardHolder",
  init: function(){
    this.superInit();
  },
});
// メイン処理
phina.main(function() {
  // アプリケーション生成
  var app = GameApp({
    startLabel: 'TitleScene',
    // シーンのリストを引数で渡す
    scenes: [
      {
        className: 'TitleScene',
        label: 'TitleScene',
      },

      {
        className: 'RuleScene',
        label: 'RuleScene',
        nextLabel: 'MakeRoomScene',
      },
      {
        className: 'MakeRoomScene',
        label: 'MakeRoomScene',
        nextLabel: 'MainScene',
      },
      {
        className: 'EnterRoomScene',
        label: 'EnterRoomScene',
        nextLabel: 'MainScene',
      },
      {
        className: 'MainScene',
        label: 'MainScene',
      },
    ],
    width:SCREEN_WIDTH,
    height:SCREEN_HEIGHT,
    assets:ASSETS,
  });
  // アプリケーション実行
  app.run();
});
