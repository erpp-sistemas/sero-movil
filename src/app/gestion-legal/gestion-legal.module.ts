import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionLegalPageRoutingModule } from './gestion-legal-routing.module';

import { GestionLegalPage } from './gestion-legal.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionLegalPageRoutingModule,
    ComponentsModule
  ],
  declarations: [GestionLegalPage]
})
export class GestionLegalPageModule {}
