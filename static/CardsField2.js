phina.globalize();

//定数
var ASSETS={
  image:{
    gara: "/static/gara.png",
    logo: "/static/logo.png",
  },
}
var CARDS={
  0: {suit:"ス", num: "A"},
  1: {suit:"ス", num: "2"},
  2: {suit:"ス", num: "3"},
  3: {suit:"ス", num: "4"},
  4: {suit:"ス", num: "5"},
  5: {suit:"ス", num: "6"},
  6: {suit:"ス", num: "7"},
  7: {suit:"ス", num: "8"},
  8: {suit:"ス", num: "9"},
  9: {suit:"ス", num: "10"},
  10: {suit:"ス", num: "J"},
  11: {suit:"ス", num: "Q"},
  12: {suit:"ス", num: "K"},
  13: {suit:"ハ", num: "A"},
  14: {suit:"ハ", num: "2"},
  15: {suit:"ハ", num: "3"},
  16: {suit:"ハ", num: "4"},
  17: {suit:"ハ", num: "5"},
  18: {suit:"ハ", num: "6"},
  19: {suit:"ハ", num: "7"},
  20: {suit:"ハ", num: "8"},
  21: {suit:"ハ", num: "9"},
  22: {suit:"ハ", num: "10"},
  23: {suit:"ハ", num: "J"},
  24: {suit:"ハ", num: "Q"},
  25: {suit:"ハ", num: "K"},
  26: {suit:"ダ", num: "A"},
  27: {suit:"ダ", num: "2"},
  28: {suit:"ダ", num: "3"},
  29: {suit:"ダ", num: "4"},
  30: {suit:"ダ", num: "5"},
  31: {suit:"ダ", num: "6"},
  32: {suit:"ダ", num: "7"},
  33: {suit:"ダ", num: "8"},
  34: {suit:"ダ", num: "9"},
  35: {suit:"ダ", num: "10"},
  36: {suit:"ダ", num: "J"},
  37: {suit:"ダ", num: "Q"},
  38: {suit:"ダ", num: "K"},
  39: {suit:"ク", num: "A"},
  40: {suit:"ク", num: "2"},
  41: {suit:"ク", num: "3"},
  42: {suit:"ク", num: "4"},
  43: {suit:"ク", num: "5"},
  44: {suit:"ク", num: "6"},
  45: {suit:"ク", num: "7"},
  46: {suit:"ク", num: "8"},
  47: {suit:"ク", num: "9"},
  48: {suit:"ク", num: "10"},
  49: {suit:"ク", num: "J"},
  50: {suit:"ク", num: "Q"},
  51: {suit:"ク", num: "K"},
};
var SCREEN_WIDTH=640;
var SCREEN_HEIGHT=960;
var OPPONENT_HEIGHT=120;
var FIELD_HEIGHT=SCREEN_WIDTH; //=640
var PLAYER_HEIGHT=SCREEN_HEIGHT-OPPONENT_HEIGHT-FIELD_HEIGHT;//=200
var CARD_WIDTH=56;
var CARD_HEIGHT=84;
var PIECESIZE=100;
var XLEFT=200;
var XCENTER=SCREEN_WIDTH/2;
var XRIGHT=440;
var YTOP=300;
var YMTOP=420;
var YMBOTTOM=540;
var YBOTTOM=660;
var KETA=5;
var PIECEPLACE={
  1: {x:XLEFT,y:YTOP},
  2: {x:XCENTER,y:YTOP},
  3: {x:XRIGHT,y:YTOP},
  4: {x:XLEFT,y:YMTOP},
  5: {x:XCENTER,y:YMTOP},
  6: {x:XRIGHT,y:YMTOP},
  7: {x:XLEFT,y:YMBOTTOM},
  8: {x:XCENTER,y:YMBOTTOM},
  9: {x:XRIGHT,y:YMBOTTOM},
  C: {x:XLEFT,y:YBOTTOM},
  0: {x:XCENTER,y:YBOTTOM},
  AC: {x:XRIGHT,y:YBOTTOM},
};
namespace = '/test';

var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);

var GRAD=Canvas.createLinearGradient(CARD_WIDTH/2,-CARD_HEIGHT/2,-CARD_WIDTH/2,CARD_HEIGHT/2);
GRAD.addColorStop(0,'green');
GRAD.addColorStop(0.5,'yellowgreen');
GRAD.addColorStop(1,'green');

// MainScene クラスを定義
phina.define('MainScene', {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit();
    // 背景色を指定
    this.backgroundColor = '#05fff2';
    this.group=DisplayElement().addChildTo(this);
    this.setButtons();
    var playerBG=RectangleShape({
      x:this.gridX.center(),
      y:SCREEN_HEIGHT-PLAYER_HEIGHT/2,
      fill:'green',
      width: SCREEN_WIDTH,
      height: PLAYER_HEIGHT,
      strokeWidth:0,
    }).addChildTo(this.group)
    this.cardgroup=DisplayElement().addChildTo(this.group);
    var numBG=RectangleShape({
      x:this.gridX.center(),
      y:OPPONENT_HEIGHT/2,
      fill:'yellow',
      width: SCREEN_WIDTH,
      height: OPPONENT_HEIGHT,
      strokeWidth:0,
    }).addChildTo(this.group);
    this.roomNum=Label({
      x:200,
      y:OPPONENT_HEIGHT/2,
      text:"room number : 00000"
    }).addChildTo(this.group);
    this.deck=Deck();
    socket.on('my_response', function(msg) {
        console.log("nya");
    });
  },
  setButtons:function(){
    //山札をめくるボタン
    var x=this.gridX.center();
    var y=this.gridY.center();
    var self=this;
    this.getcard=Rectangle(x=x,y=y).addChildTo(this.group);
    this.getcard.text=Label("山\n札").addChildTo(this.getcard);
    this.getcard.setInteractive(true);
    this.getcard.onpointend=function(){
      self.showCard(x,y+100,id=self.deck.giveCard());
      socket.emit('my_broadcast_event', {data: "nya"});

    };
    this.getcard.update=function(){
      if (self.deck.cards[0]===null){
        self.getcard.remove();
      }
    };
  },

  //カードを表示する
  showCard: function(x,y,id){
    var self=this;
    var card=Card(x,y,id).addChildTo(this.cardgroup);
    card.onpointstart=function(){
      self.cardgroup.children.forEach(function(nya){
        nya.active=false;
      });
      card.active=true;
      self.cardgroup.children.forEach(function(nya,i){
        self.cardgroup.children.forEach(function(targ,j){
          if(nya.active&&targ.active&&j<i){
            targ.active=false;
          }
        });
      });
    };
    return card;
  },
  //目的のカードを探す
  findCard: function(id){
    var targ;
    var find=false;
    var self=this;
    this.group.children.forEach(function(card){
      if(card.id=id){
        targ=card;
        find=true;
      }
    });
    if(find){
      return targ;
    }else{
      card=self.showCard(x=self.gridX.center(),y=self.gridY.center(),id=id);
      return card;
    }
  },
  //カードを動かす
  moveCard: function(x,y,id){
    var targ=this.findCard(id);
    targ.x=x;
    targ.y=y;
  },
  //カードを消去する
  deleteCard: function(id){
    var targ=this.findCard(id);
    targ.remove();
  },
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
        nextLabel:'MainScene',
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
//EnterRoomSceneクラスを定義
phina.define('EnterRoomScene',{
  superClass:'BaseScene',
  init:function(param){
    this.superInit(param.secretkey);
    this.group=DisplayElement().addChildTo(this);
    this.backgroundColor='pink';
    // ラベルを生成
    this.label = Label({
      text:Array(KETA+1).join('-'),
      x:XCENTER,
      y:180,
      fontSize:80,
    }).addChildTo(this);
    for(var i=0;i<=9;i++){
      this.createNumButton(i);
    }
    this.createCButton();
    this.entering="";
    this.goButton=GoButton().addChildTo(this.group);
    var self=this;
    this.goButton.onpointend=function(){
      self.exit({
        nextLabel:'MainScene',
        secretkey: this.secretkey,
      });
    };
  },
  createNumButton: function(i){
    var self=this;
    var num=NumberButton({x:PIECEPLACE[i].x,y:PIECEPLACE[i].y,text:i+""}).addChildTo(this.group);
    num.onpointend=function(){
      self.enteringSpace(num.text);
    };
  },
  createCButton: function(){
    var self=this;
    this.clearButton=NumberButton({x:PIECEPLACE.C.x,y:PIECEPLACE.C.y,text:"C"}).addChildTo(this.group);
    this.clearButton.onpointend=function(){
      if(self.entering.length>=1){
        self.entering=self.entering.slice(0,self.entering.length-1);
        self.setText();
      }
    };
    this.clearAllButton=NumberButton({x:PIECEPLACE.AC.x,y:PIECEPLACE.AC.y,text:"AC"}).addChildTo(this.group);
    this.clearAllButton.onpointend=function(){
      self.ClearAll();
    };
  },
  enteringSpace: function(text){
    if(this.entering.length<KETA-1){
      this.entering+=text;
    }else{
      this.entering=this.entering.slice(0,KETA-1)+text;
    }
    this.setText();
  },
  setText: function(){
    this.label.text=(this.entering+Array(KETA+1).join("-")).slice(0,KETA);
    if(this.entering.length==KETA){
      this.goButton.activate();
      this.goButton.fill='blue';
    }else{
      this.goButton.inactivate();
    }
  },
  ClearAll: function(){
    this.entering="";
    this.setText();
  },
  sendCardData: function(card){
    x=card.x;
    y=card.y;
    front=card.front;
    id=card.id;
  }
});
//番号ボタンクラス
phina.define("NumberButton",{
  superClass: 'Button',
  init:function(options){
    options=(options||{}).$safe({
      width: PIECESIZE,
      height: PIECESIZE,
      fill:'green',
    });
    this.superInit(options);
    this.setInteractive(true);
  },
});
//goボタンクラス
phina.define('GoButton',{
  superClass:'Button',
  init: function(){
    this.superInit({
      x: SCREEN_WIDTH/2,
      y: SCREEN_HEIGHT*5/6,
      text: "Go",
      fill: 'gray',
      fontColor: 'white',
    });
    this.setInteractive(false);
  },
  inactivate:function(){
    this.setInteractive(false);
    this.fill='gray';
  },
  activate:function(){
    this.setInteractive(true);
    this.fill='blue';
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
  init: function(x,y,id,front=false){
    this.superInit();
    this.group=DisplayElement().addChildTo(this);
    this.active=false;
    this.id=id;
    this.x=x,
    this.y=y,
    this.dl=0,
    this.group.suit=Label({
      text:CARDS[id].suit,
      y:-CARD_HEIGHT/4,
    }).addChildTo(this.group);
    this.group.number=Label({
      text:CARDS[id].num,
      y:CARD_HEIGHT/4,
    }).addChildTo(this.group);
    this.setInteractive(true);
    this.front=front;  //表：true
    this.fill=GRAD;
    this.group.hide();
  },
  update: function(){
    if(this.active){
      this.stroke='red';
      this.strokeWidth=8;
    }else{
      this.stroke='purple';
      this.strokeWidth=4;
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
      if(e.pointer.y<OPPONENT_HEIGHT+CARD_HEIGHT/2){
        this.y=OPPONENT_HEIGHT+CARD_HEIGHT/2;
      }else if(e.pointer.y>SCREEN_HEIGHT-CARD_HEIGHT/2){
        this.y=SCREEN_HEIGHT-CARD_HEIGHT/2;
      }else{
        this.y=e.pointer.y;
      }
    }
    this.dl+=e.pointer.x*e.pointer.x+e.pointer.y*e.pointer.y;
  },
  //クリック終了時の動き
  onpointend:function(){
    if(this.dl>0){
      this.dl=0;
      this.active=false;
    }
  },
  //裏返す
  turn:function(){
    if(this.front){
      this.fill=GRAD;
      this.group.hide();
    }else{
      this.group.show();
      this.fill='white';
    }
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
//山札クラス
phina.define("Deck",{
  init: function(joker=0){
    this.cards=[];
    for(var i=0;i<(52+joker);i++){
      this.cards[i]=i;
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
  addCard:function(id){
    this.cards.push(id);
  },
  giveCard:function(){
    var a=this.cards[0];
    this.cards.splice(0,1);
    return a;
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
