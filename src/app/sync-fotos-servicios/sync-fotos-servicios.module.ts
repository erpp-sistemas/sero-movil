import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SyncFotosServiciosPageRoutingModule } from './sync-fotos-servicios-routing.module';

import { SyncFotosServiciosPage } from './sync-fotos-servicios.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SyncFotosServiciosPageRoutingModule,
    ComponentsModule
  ],
  declarations: [SyncFotosServiciosPage]
})
export class SyncFotosServiciosPageModule {}
