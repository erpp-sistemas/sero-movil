import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SyncAccionesPageRoutingModule } from './sync-acciones-routing.module';

import { SyncAccionesPage } from './sync-acciones.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SyncAccionesPageRoutingModule,
    ComponentsModule
  ],
  declarations: [SyncAccionesPage]
})
export class SyncAccionesPageModule {}
