phina.globalize();

//定数
var ASSETS={
  image:{
    logo: "/static/logo.png",
  },
}
var CARDS={
  0: {suit:"ス", num: "A",color:'black'},
  1: {suit:"ス", num: "2",color:'black'},
  2: {suit:"ス", num: "3",color:'black'},
  3: {suit:"ス", num: "4",color:'black'},
  4: {suit:"ス", num: "5",color:'black'},
  5: {suit:"ス", num: "6",color:'black'},
  6: {suit:"ス", num: "7",color:'black'},
  7: {suit:"ス", num: "8",color:'black'},
  8: {suit:"ス", num: "9",color:'black'},
  9: {suit:"ス", num: "10",color:'black'},
  10: {suit:"ス", num: "J",color:'black'},
  11: {suit:"ス", num: "Q",color:'black'},
  12: {suit:"ス", num: "K",color:'black'},
  13: {suit:"ハ", num: "A",color:'crimson'},
  14: {suit:"ハ", num: "2",color:'crimson'},
  15: {suit:"ハ", num: "3",color:'crimson'},
  16: {suit:"ハ", num: "4",color:'crimson'},
  17: {suit:"ハ", num: "5",color:'crimson'},
  18: {suit:"ハ", num: "6",color:'crimson'},
  19: {suit:"ハ", num: "7",color:'crimson'},
  20: {suit:"ハ", num: "8",color:'crimson'},
  21: {suit:"ハ", num: "9",color:'crimson'},
  22: {suit:"ハ", num: "10",color:'crimson'},
  23: {suit:"ハ", num: "J",color:'crimson'},
  24: {suit:"ハ", num: "Q",color:'crimson'},
  25: {suit:"ハ", num: "K",color:'crimson'},
  26: {suit:"ダ", num: "A",color:'crimson'},
  27: {suit:"ダ", num: "2",color:'crimson'},
  28: {suit:"ダ", num: "3",color:'crimson'},
  29: {suit:"ダ", num: "4",color:'crimson'},
  30: {suit:"ダ", num: "5",color:'crimson'},
  31: {suit:"ダ", num: "6",color:'crimson'},
  32: {suit:"ダ", num: "7",color:'crimson'},
  33: {suit:"ダ", num: "8",color:'crimson'},
  34: {suit:"ダ", num: "9",color:'crimson'},
  35: {suit:"ダ", num: "10",color:'crimson'},
  36: {suit:"ダ", num: "J",color:'crimson'},
  37: {suit:"ダ", num: "Q",color:'crimson'},
  38: {suit:"ダ", num: "K",color:'crimson'},
  39: {suit:"ク", num: "A",color:'black'},
  40: {suit:"ク", num: "2",color:'black'},
  41: {suit:"ク", num: "3",color:'black'},
  42: {suit:"ク", num: "4",color:'black'},
  43: {suit:"ク", num: "5",color:'black'},
  44: {suit:"ク", num: "6",color:'black'},
  45: {suit:"ク", num: "7",color:'black'},
  46: {suit:"ク", num: "8",color:'black'},
  47: {suit:"ク", num: "9",color:'black'},
  48: {suit:"ク", num: "10",color:'black'},
  49: {suit:"ク", num: "J",color:'black'},
  50: {suit:"ク", num: "Q",color:'black'},
  51: {suit:"ク", num: "K",color:'black'},
  52: {suit:"バ", num: "バ",color:'black'},
  53: {suit:"バ", num: "バ",color:'crimson'},
};
var SCREEN_WIDTH=640;
var SCREEN_HEIGHT=960;
var FIELD_HEIGHT=SCREEN_WIDTH; //=640
var FIELD_CENTER_X=SCREEN_WIDTH/2;
var FIELD_CENTER_Y=440;
var OPPONENT_HEIGHT=FIELD_CENTER_Y-FIELD_HEIGHT/2;//=120
var PLAYER_HEIGHT=SCREEN_HEIGHT-FIELD_CENTER_Y-FIELD_HEIGHT/2;//=200
var CARD_WIDTH=56;
var CARD_HEIGHT=84;
var PIECESIZE=100;
var XSPACE=120;
var YSPACE=XSPACE;
var XCENTER=SCREEN_WIDTH/2;
var XRIGHT=XCENTER+XSPACE;
var XLEFT=XCENTER-XSPACE;
var YTOP=240;
var YMTOP=YTOP+YSPACE;
var YMBOTTOM=YMTOP+YSPACE;
var YBOTTOM=YMBOTTOM+YSPACE;
var KETA=4;
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
  init: function(param) {
    this.superInit();
    // 背景色を指定
    this.backgroundColor = '#05fff2';
    this.secretkey=param.secretkey;
    this.group=DisplayElement().addChildTo(this);
    this.roomId=param.roomId!==undefined?param.roomId:"0000";
    this.myId=param.myId;
    this.player=param.player;  //0:親,1:左,2:対面,3:右
    var playerBG=RectangleShape({
      x:this.gridX.center(),
      y:SCREEN_HEIGHT-PLAYER_HEIGHT/2,
      fill:'green',
      width: SCREEN_WIDTH,
      height: PLAYER_HEIGHT,
      strokeWidth:0,
    }).addChildTo(this.group);
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
      x:180,
      y:OPPONENT_HEIGHT/2,
      fontSize:40,
    }).addChildTo(this.group);
    this.bg=Sprite("logo").addChildTo(this.group);
    this.bg.x=480;
    this.bg.y=OPPONENT_HEIGHT/2;
    this.bg.scaleX-=0.6;
    this.bg.scaleY-=0.6;
    this.setRoomNumber();
    if(this.player==0){
      this.setDeck();
      this.sendAllCardData();
      this.receiveCardData();
    }else{
      this.reqAllCardData();
      this.receiveAllCardData();
    }
  },
  reqAllCardData:function(){
    socket.emit('reqcard',{room:this.roomId});
    return false;
  },
  sendAllCardData:function(){
    var self=this;
    socket.on('reqcard', function(){
      var cards=[];
      self.cardgroup.children.forEach(function(nya){
        cards.push({
          room: nya.roomId,
          id:nya.id,
          x:nya.x-FIELD_CENTER_X,
          y:nya.y-FIELD_CENTER_Y,
          front:this.front,
        });
      });
      socket.emit('initcard',{room:self.roomId,cards:cards});
    });
  },
  receiveAllCardData:function(){
    var self=this;
    socket.on('initcard', function(datas){
      datas.cards.forEach(function(nya){
        var card=self.showCard(FIELD_CENTER_X,FIELD_CENTER_Y,nya.id);
        if(nya.front){
          card.turntofront();
        }else{
          card.turntoback();
        }
        switch (self.player) {
          case 1:
            card.x=FIELD_CENTER_X+nya.y;
            card.y=FIELD_CENTER_Y-nya.x;
            break;
          case 2:
            card.x=FIELD_CENTER_X-nya.x;
            card.y=FIELD_CENTER_Y-nya.y;
            break;
          case 3:
            card.x=FIELD_CENTER_X-nya.y;
            card.y=FIELD_CENTER_Y+nya.x;
            break;
          default:
            card.x=FIELD_CENTER_X+nya.x;
            card.y=FIELD_CENTER_Y+nya.y;
            break;
        }
      });
      self.receiveCardData();
      return false;
    });
  },
  setRoomNumber:function(){
    this.roomNum.text="room id:"+this.roomId;
  },
  onpointstart:function(){
    var self=this;
    self.cardgroup.children.forEach(function(nya,i){
      self.cardgroup.children.forEach(function(targ,j){
        if(nya.selected&&targ.selected&&j<i){
          targ.selected=false;
        }
      });
    });
    self.cardgroup.children.forEach(function(nya,i){
      if(nya.selected){
        if(nya.active){
          nya.turn();
          nya.active=false;
        }else{
          nya.active=true;
        }
      }else{
        nya.active=false;
      }
    });
  },
  setDeck:function(){
    var self=this;
    cards=[...Array(54).keys()];
    for(var i=cards.length-1;i>0;i--){
      var r=Math.floor(Math.random()*(i+1));
      var tmp = cards[i];
      cards[i]=cards[r];
      cards[r]=tmp;
    }
    self.showCard(FIELD_CENTER_X+5,FIELD_CENTER_Y+5,cards[cards.length-1]);
    for(var i=cards.length-2;i>=0;i--){
      self.showCard(FIELD_CENTER_X,FIELD_CENTER_Y,cards[i]);
    }
  },
  //カードを表示する
  showCard: function(x,y,id){
    var card=Card(x,y,id,this.roomId,this.player,this.myId).addChildTo(this.cardgroup);
    return card;
  },
  //目的のカードを探す
  findCard: function(id){
    var targ;
    var find=false;
    var self=this;
    this.cardgroup.children.forEach(function(card){
      if(card.id==id){
        targ=card;
        find=true;
      }
    });
    if(find){
      return targ;
    }else{
      card=self.showCard(FIELD_CENTER_X,FIELD_CENTER_Y,id);
      return card;
    }
  },
  //カードを動かす
  moveCard: function(x,y,id){
    var targ=this.findCard(id);
    targ.x=x;
    targ.y=y;
  },
  receiveCardData:function(){
    var self=this;
    socket.on('my_card', function(datas){
      if(datas.myId!=self.myId){
        var card=self.findCard(datas.id);
        if(datas.front){
          card.turntofront();
        }else{
          card.turntoback();
        }
        switch (self.player) {
          case 1:
            card.x=FIELD_CENTER_X+datas.y;
            card.y=FIELD_CENTER_Y-datas.x;
            break;
          case 2:
            card.x=FIELD_CENTER_X-datas.x;
            card.y=FIELD_CENTER_Y-datas.y;
            break;
          case 3:
            card.x=FIELD_CENTER_X-datas.y;
            card.y=FIELD_CENTER_Y+datas.x;
            break;
          default:
            card.x=FIELD_CENTER_X+datas.x;
            card.y=FIELD_CENTER_Y+datas.y;
            break;
        }
      }
    });
  },
});
//TitleSceneクラスを定義
phina.define('TitleScene',{
  superClass:'BaseScene',
  init:function(){
    this.superInit(secretkey="default");
    this.group=DisplayElement().addChildTo(this);
    this.bg=Sprite("logo").addChildTo(this.group);
    this.bg.x=this.gridX.center();
    this.bg.y=this.gridY.center()*5/6;
    this.bg.scaleX-=0.2;
    this.bg.scaleY-=0.2;
    this.backgroundColor='lightblue';
    this.myId="nya";
    var makeRoomButton=Button({
      x: this.gridX.center()/2,
      y: this.gridY.center()*3/2,
      text: "makeroom",
      fill: 'blue',
      fontColor: 'white',
    }).addChildTo(this.group);
    var self=this;
    makeRoomButton.onpointend=function(){
      socket.emit('hostjoin');
      makeRoomButton.setInteractive(false);
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
        secretkey: self.secretkey,
        myId:self.myId,
      });
    };
    this.setSecretKey("nya");
    this.joinRoom();
    this.askmyid();
  },
  askmyid:function(){
    var self=this;
    socket.emit('answermyid');
    socket.on('myId',function(datas){
      self.myId=datas.myId[0];
    });
    return false;
  },
  joinRoom: function(){
    var self = this;
    socket.on('hostroom',function(message){
      self.exit({
        nextLabel:'MainScene',
        roomId:message.room,
        secretkey: self.secretkey,
        player:0,
        myId:self.myId,
      });
    });
    return false;
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
    this.myId=param.myId;
    this.backgroundColor='pink';
    // ラベルを生成
    this.label = Label({
      x:XCENTER,
      y:YTOP-YSPACE,
      fontSize:80,
    }).addChildTo(this);
    this.bar=Placebar().addChildTo(this.group);
    for(var i=0;i<=9;i++){
      this.createNumButton(i);
    }
    this.createCButton();
    this.entering="";
    this.goButton=GoButton().addChildTo(this.group);
    var self=this;
    this.goButton.onpointend=function(){
      socket.emit('memjoin',{room:parseInt(self.entering)});
      self.goButton.setInteractive(false);
    };
    this.askJoin();
    this.setText();
  },
  askJoin: function(){
    var self = this;
    socket.on('memroom',function(message){
      if(!message.room){
        alert("部屋がないよ");
        self.goButton.setInteractive(true);
      }else{
        self.exit({
          nextLabel:'MainScene',
          roomId:parseInt(self.entering),
          secretkey: self.secretkey,
          player:self.bar.valnum+1,
          myId:self.myId,
        });
      }
    });
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
    this.label.text="id:"+(this.entering+Array(KETA+1).join("-")).slice(0,KETA);
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
});
//位置バークラス
phina.define('Placebar',{
  superClass:'RectangleShape',
  init:function(values=["左","対面","右"],y=720){
    this.superInit({
      width: 360,
      height: 80,
      fill:"transparent",
      stroke:0,
      x:SCREEN_WIDTH/2,
      y:y,
    });
    this.valnum=1;
    this.group=DisplayElement().addChildTo(this);
    this.values=values;
    this.value=Label({text:this.values[this.valnum],x:0,fontSize:40}).addChildTo(this.group);
    this.smaller=TriangleShape({x:-80,y:0,radius:20,rotation:30,fill:'blue'}).addChildTo(this.group);
    this.smaller.setInteractive(true);
    var self=this;
    this.smaller.onpointstart=function(){
      switch (self.valnum) {
        case 2:
          self.valnum-=1
          self.larger.show();
          break;
        case 1:
          self.valnum-=1
          self.smaller.hide();
          break;
        default:
          break;
      }
      self.value.text=self.values[self.valnum];
    };
    this.larger=TriangleShape({x:80,y:0,radius:20,rotation:-30,fill:'blue'}).addChildTo(this.group);
    this.larger.setInteractive(true);
    this.larger.onpointstart=function(){
      switch (self.valnum) {
        case 0:
          self.valnum+=1
          self.smaller.show();
          break;
        case 1:
          self.valnum+=1
          self.larger.hide();
          break;
        default:
          break;
      }
      self.value.text=self.values[self.valnum];
    };
  },
});
//番号ボタンクラス
phina.define("NumberButton",{
  superClass: 'Button',
  init:function(options){
    options=(options||{}).$safe({
      width: PIECESIZE,
      height: PIECESIZE,
      fill:'green',
      fontSize: 50,
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
      y: 840,
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
    this.secretkey=secretkey;
  },
});
/*カードクラス*/
phina.define('Card',{
  //クラス継承
  superClass:'Rectangle',
  //初期化
  init: function(x,y,id,roomId,player,myId){
    this.superInit();
    this.group=DisplayElement().addChildTo(this);
    this.active=false;
    this.selected=false;
    this.roomId=roomId;
    this.myId=myId;
    this.player=player;
    this.id=id;
    this.x=x,
    this.y=y,
    this.dl=0,
    this.group.suit=Label({
      text:CARDS[id].suit,
      y:-CARD_HEIGHT/4,
      fill:CARDS[id].color,
    }).addChildTo(this.group);
    this.group.number=Label({
      text:CARDS[id].num,
      y:CARD_HEIGHT/4,
      fill:CARDS[id].color,
    }).addChildTo(this.group);
    this.setInteractive(true);
    this.front=false;  //表：true
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
  onpointstart:function(){
    this.selected=true;
  },
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
    this.sendCardData();
  },
  //クリック終了時の動き
  onpointend:function(){
    if(this.dl>0){
      this.dl=0;
      this.active=false;
      this.sendCardData();
    }
    this.selected=false;
  },
  turntofront:function(){
    this.front=true;
    this.group.show();
    this.fill='white';
  },
  turntoback:function(){
    this.front=false;
    this.group.hide();
    this.fill=GRAD;
  },
  //反転させる
  turn:function(){
    if(this.front){
      this.turntoback();
    }else{
      this.turntofront();
    }
    this.sendCardData();
  },
  sendCardData:function(){
    var x=this.x-FIELD_CENTER_X;
    var y=this.y-FIELD_CENTER_Y;
    switch (this.player) {
      case 1:
        socket.emit('card',{
          room: this.roomId,
          id:this.id,
          x:-y,
          y:x,
          front:this.front,
          myId:this.myId,
        });
        return false;
        break;
      case 2:
        socket.emit('card',{
          room: this.roomId,
          id:this.id,
          x:-x,
          y:-y,
          front:this.front,
          myId:this.myId,
        });
        return false;
        break;
      case 3:
        socket.emit('card',{
          room: this.roomId,
          id:this.id,
          x:y,
          y:-x,
          front:this.front,
          myId:this.myId,
        });
        return false;
        break;
      default:
        socket.emit('card',{
          room: this.roomId,
          id:this.id,
          x:x,
          y:y,
          front:this.front,
          myId:this.myId,
        });
        return false;
        break;
    }
  },
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
