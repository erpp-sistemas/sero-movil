import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuperviceGestorPageRoutingModule } from './supervice-gestor-routing.module';

import { SuperviceGestorPage } from './supervice-gestor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuperviceGestorPageRoutingModule
  ],
  declarations: [SuperviceGestorPage]
})
export class SuperviceGestorPageModule {}
