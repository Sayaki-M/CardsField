phina.globalize();

//定数
var ASSETS={
  image:{
    gara: "gara.png",
    logo: "logo.png",
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
    var self=this;
    this.deck=Deck();
    this.player=Player(self);
    this.field=Field();
    this.setButtons();
  },
  setButtons:function(){
    //山札をめくるボタン
    var x=PUT_SPACE_F[0]+SPACE[0]/2+CARD_WIDTH/2+5;
    var y=PUT_SPACE_F[1];
    var self=this;
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
  //showcard: function(x,y,){


  //},

});

//TitleSceneクラスを定義
phina.define('TitleScene',{
  superClass:'BaseScene',
  init:function(){
    this.superInit(secretkey="default");
    this.group=DisplayElement().addChildTo(this);
    this.backgroundColor='lightblue';
    var makeRoomButton=Button({
      x: this.gridX.center()/2,
      y: this.gridY.center()*3/2,
      text: "makeroom",
      fill: 'blue',
      fontColor: 'white',
    }).addChildTo(this.group);
    var self=this;
    makeRoomButton.onpointend=function(){
      self.exit({
        nextLabel:'RuleScene',
        secretkey: this.secretkey,
      });
    };
    var enterRoomButton=Button({
      x: this.gridX.center()*3/2,
      y: this.gridY.center()*3/2,
      text: "enterroom",
      fill: 'blue',
      fontColor: 'white',
    }).addChildTo(this.group);
    enterRoomButton.onpointend=function(){
      self.exit({
        nextLabel:'EnterRoomScene',
        secretkey: this.secretkey,
      });
    };
    this.setSecretKey("nya");
  },
  setSecretKey: function(secretkey){
    this.secretkey=secretkey;
  },
});

//RuleSceneクラスを定義
phina.define('RuleScene',{
  superClass:'BaseScene',
  init:function(param){
    this.superInit(param.secretkey);
    this.group=DisplayElement().addChildTo(this);
    this.backgroundColor='yellowgreen';
    this.goButton=GoButton().addChildTo(this.group);
    var self=this;
    this.goButton.onpointstart=function(){
      self.exit({
        nextLabel:'MakeRoomScene',
        secretkey: this.secretkey,
      });
    };
    this.rulebar=Rulebar().addChildTo(this.group);
  },
});

//MakeRoomSceneクラスを定義
phina.define('MakeRoomScene',{
  superClass:'BaseScene',
  init:function(param){
    this.superInit(param.secretkey);
    this.group=DisplayElement().addChildTo(this);
    this.backgroundColor='lime';
    this.roomNumber=Label({
      text:"12345",
      x:this.gridX.center(),
      y:this.gridY.center()*4/3,
    }).addChildTo(this.group);
    var goButton=GoButton().addChildTo(this.group);
    var self=this;
    goButton.onpointend=function(){
      self.exit({
        nextLabel:'MainScene',
        secretkey: this.secretkey,
      });
    };
    this.setLabel("12345");
  },
  setLabel:function(num){
    this.roomNumber.text="room number:"+num;
  },
});

//EnterRoomSceneクラスを定義
phina.define('EnterRoomScene',{
  superClass:'BaseScene',
  init:function(param){
    this.superInit(param.secretkey);
    this.group=DisplayElement().addChildTo(this);
    this.backgroundColor='pink';
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
    }).addChildTo(this.group);
    enterNumber.text=Label({
      text:'put your\nroom number',
      fontSize:24,
    }).addChildTo(enterNumber);
    enterNumber.setInteractive(true);
    enterNumber.onpointstart = function() {
      input.focus();
    };
    var goButton=GoButton().addChildTo(this.group);
    var self=this;
    goButton.onpointend=function(){
      self.exit({
        nextLabel:'MainScene',
        secretkey: this.secretkey,
      });
    };
  },
});
//Sceneの基本デザインを定義
phina.define('BaseScene',{
  superClass: 'DisplayScene',
  init: function(secretkey){
    this.superInit();
    this.group=DisplayElement().addChildTo(this);
    this.bg=Sprite("logo").addChildTo(this.group);
    this.bg.x=this.gridX.center();
    this.bg.y=this.gridY.center()*5/6;
    this.bg.scaleX-=0.2;
    this.bg.scaleY-=0.2;
    this.secretkey=secretkey;
  },
});
/*カードクラス*/
phina.define('Card',{
  //クラス継承
  superClass:'Rectangle',
  //初期化
  init: function(x,y,num=2,suit=2,position="field",front=false){
    this.superInit({x:x,y:y});
    this.group=DisplayElement().addChildTo(this);
    this.x=x;
    this.y=y;
    this.active=false;
    this.group.suit=Label({
      text:SUITS[suit],
      y:-CARD_HEIGHT/4,
    }).addChildTo(this.group);
    this.group.number=Label({
      text:NUMS[num],
      y:CARD_HEIGHT/4,
    }).addChildTo(this.group);
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
//ルールクラス
phina.define('Rulebar',{
  superClass:'RectangleShape',
  init:function(label="member",values=["nya","wan","kon"],y=100){
    this.superInit({
      width: 400,
      height: 80,
      fill:"white",
      x:SCREEN_WIDTH/2,
      y:y,
    });
    this.valnum=0;
    this.group=DisplayElement().addChildTo(this);
    this.label=Label({text:label,x:-100}).addChildTo(this.group);
    this.values=values;
    this.value=Label({text:this.values[this.valnum],x:100}).addChildTo(this.group);
    this.smaller=TriangleShape({x:50,y:0,radius:30,rotation:30,}).addChildTo(this.group);
    this.smaller.setInteractive(true);
    self=this;
    this.smaller.onpointstart=function(){
      if(self.valnum>=1){
        self.valnum-=1;
        self.value.text=self.values[self.valnum];
      }
    };
    this.larger=TriangleShape({x:150,y:0,radius:30,rotation:-30}).addChildTo(this.group);
    this.larger.setInteractive(true);
    this.larger.onpointstart=function(){
      if(self.valnum<=self.values.length-2){
        self.valnum+=1;
        self.value.text=self.values[self.valnum];
      }
    };
  },

});
//goボタンクラス
phina.define('GoButton',{
  superClass:'Button',
  init: function(){
    this.superInit({
      x: SCREEN_WIDTH/2,
      y: SCREEN_HEIGHT*3/4,
      text: "Go",
      fill: 'blue',
      fontColor: 'white',
    });
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
