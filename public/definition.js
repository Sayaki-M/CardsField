phina.globalize();

//定数
const ASSETS = {
  image: {
    logo: "logo.png",
  },
};

const SCREEN_WIDTH = 640;
const SCREEN_HEIGHT = 960;
const FIELD_HEIGHT = SCREEN_WIDTH; //=640
const FIELD_CENTER_X = SCREEN_WIDTH / 2;
const FIELD_CENTER_Y = 440;
const OPPONENT_HEIGHT = FIELD_CENTER_Y - FIELD_HEIGHT / 2; //=120
const PLAYER_HEIGHT = SCREEN_HEIGHT - FIELD_CENTER_Y - FIELD_HEIGHT / 2; //=200
const KETA = 4;

const socket = io();
