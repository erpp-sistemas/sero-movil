import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SincronizarAguaPageRoutingModule } from './sincronizar-agua-routing.module';

import { SincronizarAguaPage } from './sincronizar-agua.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SincronizarAguaPageRoutingModule
  ],
  declarations: [SincronizarAguaPage]
})
export class SincronizarAguaPageModule {}
