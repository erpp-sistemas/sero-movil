import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioTempPageRoutingModule } from './inicio-temp-routing.module';

import { InicioTempPage } from './inicio-temp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioTempPageRoutingModule
  ],
  declarations: [InicioTempPage]
})
export class InicioTempPageModule {}
