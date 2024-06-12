import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapaPruebaPageRoutingModule } from './mapa-google-routing.module';

import { MapaPruebaPage } from './mapa-google.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapaPruebaPageRoutingModule,
    ComponentsModule
  ],
  declarations: [MapaPruebaPage]
})
export class MapaPruebaPageModule {}
