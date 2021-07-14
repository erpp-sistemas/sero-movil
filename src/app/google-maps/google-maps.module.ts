import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { GoogleMapsPageRoutingModule } from './google-maps-routing.module';

import { GoogleMapsPage } from './google-maps.page';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    GoogleMapsPageRoutingModule
  ],
  declarations: [GoogleMapsPage]
})
export class GoogleMapsPageModule {}
