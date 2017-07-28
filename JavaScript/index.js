// 送信するデータのフォーマットとしては
// 水平番号,色,鉛直番号,色
// ex) 水平のLEDの番号は5，色は緑，鉛直のLEDの番号は1色はシアン
// 05,g,1,c
// 水平番号は00-99，鉛直番号は0-9までと仮定して，それぞれ二桁と一桁として長さは固定。
// 色は以下のように対応する
// BLACK  b
// RED    r
// GREEN  g
// YELLOW y
// BLUE   b
// PURPLE p
// CYAN   c
// WHITE  w

var SerialPort = require('serialport');
var Readline = SerialPort.parsers.Readline;
var port = new SerialPort('/dev/cu.usbmodem14111', {
  baudrate: 9600
});
var parser = port.pipe(Readline({delimiter: '\r\n'}));

port.on('open', function () {
  console.log('Serial open.');
  setInterval(write, 1000, '08,g,1,c\n');
});

port.on('data', function (data) {
  console.log('Data: ' + data);
});

function write(data) {
    console.log('Write: ' + data);
    port.write(new Buffer(data), function(err, results) {
      if(err) {
        console.log('Err: ' + err);
        console.log('Results: ' + results);
      }
  });
}
