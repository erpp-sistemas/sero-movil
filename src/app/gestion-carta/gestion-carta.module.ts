import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionCartaPageRoutingModule } from './gestion-carta-routing.module';

import { GestionCartaPage } from './gestion-carta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionCartaPageRoutingModule
  ],
  //declarations: [GestionCartaPage]
})
export class GestionCartaPageModule {}
