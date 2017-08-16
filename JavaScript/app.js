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
var PORT = 4000 || process.env.PORT;
var app = express();

// var status = {
// 	nickname: "じゅんじゅん",
// 	nickname_y: "ジュンジュン",
// 	sex: "男",
// 	bloodtype: "O",
// 	birthdateY: 1997,
// 	birthdateM: 3,
// 	birthdateD: 3,
// 	age: 19,
// 	constellations: "魚座",
// 	place: "大阪"
// };

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

// app.get("/api",function(req,res){
// 	var value = req.query.text,
// 			url = "https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue?APIKEY=",
// 			token = process.env.DOCOMO_API_KEY;
//
// 	status.utt = value;
//
// 	var param = {
// 		body: JSON.stringify(status),
// 		"Content-Type": "application/json"
// 	}
//
// 	request.post(url+token,param,function(err,response,data){
// 		if (err) throw err;
// 		var body = JSON.parse(data)
// 		status.context = body.context;
// 		body.utt = value == "バイバイ" ? "またねー！" : body.utt
// 		res.json({
// 			res: body.utt
// 		})
// 	});
//
// })

// postされたとき
app.post('/set',function(req, res){

    var obj = {};
    // console.log('body: ' + JSON.stringify(req.body.name));
    // write('08,g,2,c\n');
    // write('08,k,2,k\n');
    var rejson = JSON.stringify(req.body);
    res.send(rejson);
});

app.listen(PORT,function(){
	console.log("app is http://localhost:"+PORT)
})
