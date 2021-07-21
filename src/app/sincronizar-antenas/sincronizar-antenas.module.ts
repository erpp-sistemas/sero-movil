import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SincronizarAntenasPageRoutingModule } from './sincronizar-antenas-routing.module';

import { SincronizarAntenasPage } from './sincronizar-antenas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SincronizarAntenasPageRoutingModule
  ],
  declarations: [SincronizarAntenasPage]
})
export class SincronizarAntenasPageModule {}
