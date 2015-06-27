#include <16F628.h> //select uC 
#fuses HS, NOLVP, NOWDT, PUT, noBROWNOUT //setup
#use delay(clock=20000000) 
#use rs232(baud=115200, xmit=PIN_b2, rcv=PIN_b1,errors) //use uart i/o
#use fast_io( a ) //switch for fast response
#use fast_io( b )
#include <stdio.h>
#include <input.c>
#include <stdlib.h>
unsigned INT16 o=0, i, dis;
char query[2]={0x00,0x00};
char val_o[2];
byte dimmer=false;


#INT_EXT //external interrupt activeted by phase L to H edge  
void zero_ISR()        
{
   dimmer=true;
}

#INT_TIMER0 //internal interrupt timer to burn loop light
void dim()
{
   IF (dimmer)
   {
      output_high(pin_b6);
      delay_us(o);
      output_low(pin_b6);
      dimmer=false;
   }

   
}

void main()
{
   setup_timer_0(RTCC_INTERNAL|RTCC_DIV_2); //select internal timer speed 
   enable_interrupts(INT_TIMER0); //enable internal interrupt
   set_timer0(0); //timer speed 
   output_b(0x00);
   set_tris_a(0x20); //set port A as I or O
   set_tris_b(0x03); //set port B -/-
   ext_INT_edge(L_TO_H); //ext interrupt active edge
   enable_interrupts(INT_ext); //enable external interrupt
   enable_interrupts(GLOBAL); //enable space for int

while(true)
{
   IF(kbhit()) //activate buff for uart signal
   {
      gets(query);
      val_o[0]=query[0];
      val_o[1]=query[1];
      o=make16(val_o[0],val_o[1]); //create int from hex 
      printf("received:%x%x o:%Lu\r\n",query[0],query[1],o); //received inf to edi
   }
}

}
