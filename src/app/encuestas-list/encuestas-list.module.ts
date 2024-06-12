import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncuestasListPageRoutingModule } from './encuestas-list-routing.module';

import { EncuestasListPage } from './encuestas-list.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncuestasListPageRoutingModule,
    ComponentsModule
  ],
  declarations: [EncuestasListPage]
})
export class EncuestasListPageModule {}
