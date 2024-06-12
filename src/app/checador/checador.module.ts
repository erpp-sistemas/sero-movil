import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChecadorPageRoutingModule } from './checador-routing.module';

import { ChecadorPage } from './checador.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChecadorPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ChecadorPage]
})
export class ChecadorPageModule {}
