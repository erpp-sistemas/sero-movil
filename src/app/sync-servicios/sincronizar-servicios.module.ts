import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SincronizarServiciosPageRoutingModule } from './sincronizar-servicios-routing.module';

import { SincronizarServiciosPage } from './sincronizar-servicios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SincronizarServiciosPageRoutingModule
  ],
  declarations: [SincronizarServiciosPage]
})
export class SincronizarServiciosPageModule {}
