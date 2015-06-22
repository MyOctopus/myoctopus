#include <16F628.h>
#fuses HS, NOLVP, NOWDT, PUT, noBROWNOUT
#use delay(clock=20000000)
#use rs232(baud=115200, xmit=PIN_b2, rcv=PIN_b1,  timeout=4000)
#use fast_io ( a )
#use fast_io ( b )
#include <stdio.h>
#include <input.c>
#include <stdlib.h>
unsigned INT16 o=1;
byte dimmer=false, lock=true;
#INT_EXT
void zero_ISR()        
{
   dimmer=true;
}

#INT_TIMER0
void dim()
{
   o++;
   IF (o==10000) o=1;
}

void main()
{
   setup_timer_0(RTCC_INTERNAL | RTCC_DIV_2);
   enable_interrupts(INT_TIMER0);
   set_timer0(0);
   output_b(0x00);
   set_tris_a(0x20);
   set_tris_b(0x03);
   ext_INT_edge(L_TO_H);
   enable_interrupts(INT_ext);
   enable_interrupts(GLOBAL);
   WHILE (true)
   {
      IF (dimmer)
      {
         output_high (pin_b6) ;
         delay_us (o) ;
         output_low (pin_b6) ;
         dimmer = false;
      }
   }

}


