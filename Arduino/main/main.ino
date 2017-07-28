// https == n)//github.com/adafruit/Adafruit_NeoPixel
// http == n)//mag.switch-science.com/2013/04/01/fullcolor_serialled_tape/

#include <Adafruit_NeoPixel.h>
#define MAX_VAL 64  // 0 to 255 for brightness
#define DELAY_TIME 50
#define DELAY_TIME2 20

#define HORIZONTAL 0 
#define VERTICAL   1

// Parameter 1 = LEDの数
// Parameter 2 = 使うピン番号
// Parameter 3 = データの並べ方や転送速度
//   NEO_RGB     Pixels are wired for RGB bitstream
//   NEO_GRB     Pixels are wired for GRB bitstream
//   NEO_KHZ400  400 KHz bitstream (e.g. FLORA pixels)
//   NEO_KHZ800  800 KHz bitstream (e.g. High Density LED strip)
// 水平方向
Adafruit_NeoPixel horizontal = Adafruit_NeoPixel(12, 2, NEO_GRB + NEO_KHZ800);
// 鉛直方向
Adafruit_NeoPixel vertical = Adafruit_NeoPixel(4, 3, NEO_GRB + NEO_KHZ800);

// Serial通信用
int recieveByte = 0;
char buf[32];
int idx;

void setup() {
  horizontal.begin();
  horizontal.show(); // Initialize all pixels to 'off'

  Serial.begin(9600);
}

void loop() {
//  for(uint16_t i=0; i<horizontal.numPixels(); i++) {
//      setPixel(i);
//      delay(100);
//  }
  idx = 0;
  while (Serial.available() > 0) {
    recieveByte = Serial.read();
    if (recieveByte == (int)'\n') break;
    buf[idx] = recieveByte;
    idx++;
  }

  // 終端記号
  buf[idx] = '\0';

  // 受け取ったデータがあるとき
  if (idx == 8) {
    // https://garchiving.com/comma-separated-by-arduino/
    // データを区切る
    int  hzn_num = atoi(strtok(buf, ","));
    char *hzn_clr = strtok(NULL, ",");
    int  vzn_num = atoi(strtok(NULL, ","));
    char *vzn_clr = strtok(NULL, ",");
    
    setPixel(HORIZONTAL, hzn_num, getColor(*hzn_clr));
    setPixel(VERTICAL  , vzn_num, getColor(*vzn_clr));
  }
  delay(100);
}
// 指定した番号のLEDを指定した色に光らせる
void setPixel(int axis, int num, uint32_t color){
  if(axis == HORIZONTAL){
    horizontal.clear();
    horizontal.setPixelColor(num, color);
    horizontal.show();
  }
  else if(axis == VERTICAL){
    vertical.clear();
    vertical.setPixelColor(num, color);
    vertical.show();
  }
  
}

// 指定した色を返す。
// 関数で取得するのなんかダサイけど、MAX_VALで最大値を変えないといけないので我慢する
// 色合いは同じなので、水平方向のものを使う
uint32_t getColor(char c){
  if('r' == c)
    return horizontal.Color(MAX_VAL, 0, 0);
  if('g' == c)
    return horizontal.Color(0, MAX_VAL, 0);
  if('y' == c)
    return horizontal.Color(MAX_VAL, MAX_VAL, 0);
  if('b' == c)
    return horizontal.Color(0, 0, MAX_VAL);
  if('p' == c)
    return horizontal.Color(MAX_VAL, 0, MAX_VAL);
  if('c' == c)
    return horizontal.Color(0, MAX_VAL, MAX_VAL);
  if('w' == c)
    return horizontal.Color(MAX_VAL, MAX_VAL, MAX_VAL);
}
