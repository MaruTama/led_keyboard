// 送信するデータのフォーマットとしては
// 水平番号,色,鉛直番号,色
// ex) 水平のLEDの番号は5，色は緑，鉛直のLEDの番号は1色はシアン
// 05,g,1,c
// 水平番号は00-99，鉛直番号は0-9までと仮定して，それぞれ二桁と一桁として長さは固定。
// 色は以下のように対応する
// BLACK  k(何も点灯しない)
// RED    r
// GREEN  g
// YELLOW y
// BLUE   b
// PURPLE p
// CYAN   c
// WHITE  w

const RED    = "r";
const GREEN  = "g";
const YELLOW = "y";
const BLUE   = "b";
const PURPLE = "p";
const CYAN   = "c";
const WHITE  = "w";

// 表示する色を変更する
const COLOR = GREEN;

// シリアル通信関係
var SerialPort = require('serialport');
var Readline = SerialPort.parsers.Readline;
var port = new SerialPort('/dev/cu.usbmodem14111', {
  baudrate: 9600
});
var parser = port.pipe(Readline({delimiter: '\r\n'}));

// シリアルポートを開いたとき
port.on('open', function () {
  console.log('Serial open.');
  // setInterval(write, 1000, '08,g,1,c\n');
});
// 受信したとき
port.on('data', function (data) {
  console.log('Data: ' + data);
});
// データのシリアル送信
function write(data) {
    console.log('Write: ' + data);
    port.write(new Buffer(data), function(err, results) {
      if(err) {
        console.log('Err: ' + err);
        console.log('Results: ' + results);
      }
  });
}


// Web Speech API + 雑談APIで楽しく会話
// http://qiita.com/konojunya/items/8be3ef22bbc819b59a28
var express = require("express");
var request = require('request');
var bodyParser = require('body-parser');
var led_keyboard = require('./LEDkeyboard');
var hepburn = require("hepburn"); // ひらがな->ローマ字変換
var PORT = 4000 || process.env.PORT;
var app = express();

// Node.jsとjQuery.Ajaxの通信
// http://qiita.com/nishun0419/items/5f223cc0c39ec65e620c
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

// http://localhost:4000 にアクセスしたとき
app.get("/",function(req,res){
	res.sendfile("index.html");
})

app.get("/regcongnition.json",function(req,res){
	res.sendfile("regcongnition.json");
})

// postされたとき
app.post('/set',function(req, res){

    // 何m秒間LEDを点灯させるか(後で文字ごとに変更できたらいいかな)
    var litgthtime = 5000;
    // 何秒後に消灯するか(子音があるかないかで変わる)
    var delaytime;

    // postされた文字列は、ひらがな一文字であるとする
    console.log('body: ' + JSON.stringify(req.body.name));
    // write('08,g,2,c\n');
    // write('08,k,2,k\n');

    // ひらがな->ローマ字変換
    var romaji = hepburn.fromKana(req.body.name);
    console.log(romaji);
    // ローマ字からLEDの位置を取得
    var led = led_keyboard.getLED_Position(romaji.charAt(0));
    // 0のパッティングの方法
    // http://takuya-1st.hatenablog.jp/entry/2014/12/03/114154
    write(("0" + led.x).substr(-2) + "," + COLOR + "," + led.y +"," + COLOR + "\n");
    // 子音と母音がある文字のとき
    if(romaji.length == 2){
      led = led_keyboard.getLED_Position(romaji.charAt(1));
      // delaytime ms後に二文字目(母音)のLEDを点灯する
      setTimeout(
        function(){
          write(("0" + led.x).substr(-2) + "," + COLOR + "," + led.y +"," + COLOR + "\n");
        }, litgthtime);
      delaytime = litgthtime * 2;
    }
    else{
      delaytime = litgthtime
    }
    // 消灯
    setTimeout(
      function(){
        write(("0" + led.x).substr(-2) + ",k," + led.y +",k\n");
      }, delaytime);

    var rejson = JSON.stringify(req.body);
    res.send(rejson);
});

app.listen(PORT,function(){
	console.log("app is http://localhost:"+PORT)
})
