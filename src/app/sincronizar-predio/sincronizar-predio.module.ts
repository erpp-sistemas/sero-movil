import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SincronizarPredioPageRoutingModule } from './sincronizar-predio-routing.module';

import { SincronizarPredioPage } from './sincronizar-predio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SincronizarPredioPageRoutingModule
  ],
  declarations: [SincronizarPredioPage]
})
export class SincronizarPredioPageModule {}
