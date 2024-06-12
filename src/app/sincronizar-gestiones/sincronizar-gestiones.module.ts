import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SincronizarGestionesPageRoutingModule } from './sincronizar-gestiones-routing.module';

import { SincronizarGestionesPage } from './sincronizar-gestiones.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SincronizarGestionesPageRoutingModule,
    ComponentsModule
  ],
  declarations: [SincronizarGestionesPage]
})
export class SincronizarGestionesPageModule {}
