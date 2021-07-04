import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionPagePageRoutingModule } from './gestion-page-routing.module';

import { GestionPagePage } from './gestion-page.page';
import { GestionInspeccionAguaPage } from '../gestion-inspeccion-agua/gestion-inspeccion-agua.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionPagePageRoutingModule
  ],
  declarations: [GestionPagePage, GestionInspeccionAguaPage]
})
export class GestionPagePageModule {}
