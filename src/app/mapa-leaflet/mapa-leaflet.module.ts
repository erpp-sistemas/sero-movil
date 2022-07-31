import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapaLeafletPageRoutingModule } from './mapa-leaflet-routing.module';

import { MapaLeafletPage } from './mapa-leaflet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapaLeafletPageRoutingModule
  ],
  declarations: [MapaLeafletPage]
})
export class MapaLeafletPageModule {}
