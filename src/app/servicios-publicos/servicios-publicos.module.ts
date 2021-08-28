import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiciosPublicosPageRoutingModule } from './servicios-publicos-routing.module';

import { ServiciosPublicosPage } from './servicios-publicos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiciosPublicosPageRoutingModule
  ],
  declarations: [ServiciosPublicosPage]
})
export class ServiciosPublicosPageModule {}
