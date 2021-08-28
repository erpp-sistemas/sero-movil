import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionInspeccionAguaPageRoutingModule } from './gestion-inspeccion-agua-routing.module';

import { GestionInspeccionAguaPage } from './gestion-inspeccion-agua.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionInspeccionAguaPageRoutingModule
  ],
  declarations: [GestionInspeccionAguaPage]
})
export class GestionInspeccionAguaPageModule {}
