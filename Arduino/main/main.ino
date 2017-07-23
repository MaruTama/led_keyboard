// https == n)//github.com/adafruit/Adafruit_NeoPixel
// http == n)//mag.switch-science.com/2013/04/01/fullcolor_serialled_tape/

#include <Adafruit_NeoPixel.h>
#define MAX_VAL 64  // 0 to 255 for brightness
#define DELAY_TIME 50
#define DELAY_TIME2 20

#define BLACK  0
#define RED    1
#define GREEN  3
#define YELLOW 4
#define BLUE   5
#define PURPLE 6
#define CYAN   7
#define WHITE  8

// Parameter 1 = LEDの数
// Parameter 2 = 使うピン番号
// Parameter 3 = データの並べ方や転送速度
//   NEO_RGB     Pixels are wired for RGB bitstream
//   NEO_GRB     Pixels are wired for GRB bitstream
//   NEO_KHZ400  400 KHz bitstream (e.g. FLORA pixels)
//   NEO_KHZ800  800 KHz bitstream (e.g. High Density LED strip)
Adafruit_NeoPixel strip = Adafruit_NeoPixel(60, 2, NEO_GRB + NEO_KHZ800);

void setup() {
  strip.begin();
  strip.show(); // Initialize all pixels to 'off'
}

void loop() {
  for(uint16_t i=1; i<=strip.numPixels(); i++) {
      setPixel(i);
      delay(100);
  }
}
// 緑に光らせる(目に優しそうなので)
void setPixel(int num){
  strip.clear();
  strip.setPixelColor(num, getColor(GREEN));
  strip.show();
}
// 指定した色を返す。
// 関数で取得するのなんかダサイけど、MAX_VALで最大値を変えないといけないので我慢する
uint32_t getColor(int n){
  if(BLACK == n)
    return strip.Color(0, 0, 0);
  if(RED == n)
    return strip.Color(MAX_VAL, 0, 0);
  if(GREEN == n)
    return strip.Color(0, MAX_VAL, 0);
  if(YELLOW == n)
    return strip.Color(MAX_VAL, MAX_VAL, 0);
  if(BLUE == n)
    return strip.Color(0, 0, MAX_VAL);
  if(PURPLE == n)
    return strip.Color(MAX_VAL, 0, MAX_VAL);
  if(CYAN == n)
    return strip.Color(0, MAX_VAL, MAX_VAL);
  if(WHITE == n)
    return strip.Color(MAX_VAL, MAX_VAL, MAX_VAL);
}
