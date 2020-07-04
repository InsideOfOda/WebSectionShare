#include"LIS3DHTR.h"

#include <SPI.h>

#include <TFT_eSPI.h> // Hardware-specific library

TFT_eSPI tft = TFT_eSPI();       // Invoke custom library

#define TFT_GREY 0x5AEB // New colour

LIS3DHTR<TwoWire> lis;
 
//Adjust this threshold value for sensitivity of clicking
//->ref: https://wiki.seeedstudio.com/Wio-Terminal-IMU-Tapping/
#define THRESHOLD 5

uint8_t cnt=0;
 
void count() {
     //counting taps
     cnt++;
     
     //setting for only funny
     tft.init();
     tft.setRotation(2);
     //tft.fillScreen(random(0xFFFF));
     tft.fillScreen(TFT_BLACK);
     tft.setCursor(0, 0, 2);
     tft.setTextColor(TFT_YELLOW); tft.setTextFont(7);
     //print 
     tft.println(cnt);

     //debug
     Serial.print("Tap Count: ");
     Serial.println(cnt);
    
}
 
void setup() {
    Serial.begin(115200);
    lis.begin(Wire1);
 
    if (!lis) {
        Serial.println("ERROR");
        while(1);
    }
    lis.setOutputDataRate(LIS3DHTR_DATARATE_25HZ); //Data output rate
    lis.setFullScaleRange(LIS3DHTR_RANGE_2G); //Scale range set to 2g
 
    //1 for single click, 2 for double click
    //smaller the threshold value, the more sensitive
    lis.click(1, THRESHOLD);
    //Interrupt signal to trigger when a tap is detected!
    attachInterrupt(digitalPinToInterrupt(GYROSCOPE_INT1), count, RISING);

     tft.init();
     tft.setRotation(2);
     tft.fillScreen(random(0xFFFF));
     tft.setCursor(0, 0, 2);
     tft.setTextColor(TFT_YELLOW); tft.setTextFont(7);
}
 
void loop() {
}
