import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionInspeccionAntenaPageRoutingModule } from './gestion-inspeccion-antena-routing.module';

import { GestionInspeccionAntenaPage } from './gestion-inspeccion-antena.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionInspeccionAntenaPageRoutingModule
  ],
  declarations: [GestionInspeccionAntenaPage]
})
export class GestionInspeccionAntenaPageModule {}
