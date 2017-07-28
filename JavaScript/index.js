// シリアルポートに定期的に書き込んではデータを受け取る
// パーストークンは \n
// 1秒おき送信
var SerialPort = require('serialport');
var Readline = SerialPort.parsers.Readline;
var port = new SerialPort('/dev/cu.usbmodem14111', {
  baudrate: 9600
});
var parser = port.pipe(Readline({delimiter: '\r\n'}));

port.on('open', function () {
  console.log('Serial open.');
  setInterval(write, 1000, 'OK\n');
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
