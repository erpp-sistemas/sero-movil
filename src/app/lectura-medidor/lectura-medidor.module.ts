import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LecturaMedidorPageRoutingModule } from './lectura-medidor-routing.module';

import { LecturaMedidorPage } from './lectura-medidor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LecturaMedidorPageRoutingModule
  ],
  declarations: [LecturaMedidorPage]
})
export class LecturaMedidorPageModule {}
