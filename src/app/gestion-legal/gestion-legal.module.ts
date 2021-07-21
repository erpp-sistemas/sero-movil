import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionLegalPageRoutingModule } from './gestion-legal-routing.module';

import { GestionLegalPage } from './gestion-legal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionLegalPageRoutingModule
  ],
  //declarations: [GestionLegalPage]
})
export class GestionLegalPageModule {}
