import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionInspeccionPredioPageRoutingModule } from './gestion-inspeccion-predio-routing.module';

import { GestionInspeccionPredioPage } from './gestion-inspeccion-predio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionInspeccionPredioPageRoutingModule
  ],
  declarations: [GestionInspeccionPredioPage]
})
export class GestionInspeccionPredioPageModule {}
