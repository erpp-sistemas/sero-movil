import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SyncEncuestasPageRoutingModule } from './sync-encuestas-routing.module';

import { SyncEncuestasPage } from './sync-encuestas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SyncEncuestasPageRoutingModule
  ],
  declarations: [SyncEncuestasPage]
})
export class SyncEncuestasPageModule {}
