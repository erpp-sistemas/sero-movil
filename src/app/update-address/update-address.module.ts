import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateAddressPageRoutingModule } from './update-address-routing.module';

import { UpdateAddressPage } from './update-address.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateAddressPageRoutingModule
  ],
  declarations: [UpdateAddressPage]
})
export class UpdateAddressPageModule {}
