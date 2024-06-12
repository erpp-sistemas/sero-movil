import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SyncFotosAccionesPageRoutingModule } from './sync-fotos-acciones-routing.module';

import { SyncFotosAccionesPage } from './sync-fotos-acciones.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SyncFotosAccionesPageRoutingModule,
    ComponentsModule
  ],
  declarations: [SyncFotosAccionesPage]
})
export class SyncFotosAccionesPageModule {}
