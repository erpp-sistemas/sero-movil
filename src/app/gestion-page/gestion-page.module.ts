import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionPagePageRoutingModule } from './gestion-page-routing.module';
import { ComponentsModule } from '../components/components.module';

import { GestionPagePage } from './gestion-page.page';
//import { GestionInspeccionAguaPage } from '../gestion-inspeccion-agua/gestion-inspeccion-agua.page';
//import { GestionCartaPage } from '../gestion-carta/gestion-carta.page';
//import { GestionLegalPage } from '../gestion-legal/gestion-legal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    GestionPagePageRoutingModule
  ],
  declarations: [
    GestionPagePage, 
    //GestionInspeccionAguaPage, 
    //GestionCartaPage, 
    //GestionLegalPage
  ]
})
export class GestionPagePageModule {}
