import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiciosPublicosPageRoutingModule } from './servicios-publicos-routing.module';

import { ServiciosPublicosPage } from './servicios-publicos.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiciosPublicosPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ServiciosPublicosPage]
})
export class ServiciosPublicosPageModule {}
