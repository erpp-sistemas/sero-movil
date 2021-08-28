import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapaPredioPageRoutingModule } from './mapa-predio-routing.module';

import { MapaPredioPage } from './mapa-predio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapaPredioPageRoutingModule
  ],
  declarations: [MapaPredioPage]
})
export class MapaPredioPageModule {}
