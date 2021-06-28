import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StreetviewPageRoutingModule } from './streetview-routing.module';

import { StreetviewPage } from './streetview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StreetviewPageRoutingModule
  ],
  declarations: [StreetviewPage]
})
export class StreetviewPageModule {}
