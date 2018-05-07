
// Q-P間距離(mm)
var width  = 190.0;
// Q-P行とZ-M行の距離
var height =  57.0;
// qとaの距離
var q2a    =   5.0;
// qとzの距離
var q2z    =  10.0;
// LED間の距離
var LED2LED   = 16.5;
var LED_width =  5.0;

// LEDの数
var horizontal_LEDs = 12;
var vertical_LEDs   =  3;

var kb = [['Q','W','E','R','T','Y','U','I','O','P'],
          ['A','S','D','F','G','H','J','K','L',' '],
          ['Z','X','C','V','B','N','M',' ',' ',' ']];

// var a = getLED_Position('g');

// 指定された英字のxy軸上の番号を返す。(Qが0,0 Pは10,0 Zは0,2)
function getPosition(c) {
	// 2次元配列上から検索する
	for(var _y=0; _y<3; _y++){
  	var _x = kb[_y].indexOf(c);
  	if(_x != -1) return {x:_x, y:_y};
  }
  return {x:-1,y:-1};
}

// [NodeJS] モジュール定義について学ぶ
// http://www.yoheim.net/blog.php?q=20150101
// モジュール化(外部公開)する関数
module.exports = {
  // 指定された英字から光らせるLEDの位置を取得する.
  // 取得方法はkeyとLEDの中心線の距離が最も小さいものを選ぶ
  getLED_Position: function (c) {
    // 指定されたkeyはxy座標で何個目の並びであるかを取得する
    var key = getPosition(c);

    // 一つのキーの縦・横幅
    var one_key = {width:(width/10), height:(height/3)};
    // 指定されたkeyの中心線(x軸上)
    var key_centre = one_key.width*key.x + one_key.width/2;
    // keyとLEDの中心線との距離の絶対値の最小値
    var min = 100;
    // 何個目のLEDを点灯させるか
    var LED_num = {x:-1, y:-1};

    // a-l, z-m行の初期位置のズレ(下駄をはかせる)
    var bias = 0;
    if(key.y == 1)      bias = q2a;
    else if(key.y == 2) bias = q2z;

    // x方向のLED番号を取得する
    for(var i=0; i<horizontal_LEDs; i++){
      // 指定されたkeyの中心線とLEDの中心線との距離の絶対値を求める
      var temp = Math.abs(i*LED2LED+LED_width/2 - (bias+key_centre));
      //console.log(i + " : " + temp);
      if(min > temp){
        min = temp;
        LED_num.x = i;
      }
    }

    // 縦のLEDは3つのときはそのまま, 何行目かを返す。
    if(vertical_LEDs == 3){
      LED_num.y = key.y;
    }
    else{
      // 指定されたkeyの中心線(y軸上)
      // 中心線+行のバイアス
      key_centre = (one_key.height/2) + (one_key.height*key.y);
      // console.log(key_centre);
      min = 100;
      // y方向のLED番号を取得する
      for(var i=0; i<vertical_LEDs; i++){
        // 指定されたkeyの中心線とLEDの中心線との距離の絶対値を求める
        var temp = Math.abs(i*LED2LED+LED_width/2 - key_centre);
        // console.log(temp);
        if(min > temp){
          min = temp;
          LED_num.y = i;
        }
      }
    }
    console.log("LED:" + LED_num.x);
    console.log("LED:" + LED_num.y);
    return LED_num;
  }
};
