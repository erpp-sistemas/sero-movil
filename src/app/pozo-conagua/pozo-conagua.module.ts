import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { PozoConaguaPageRoutingModule } from './pozo-conagua-routing.module';

import { PozoConaguaPage } from './pozo-conagua.page';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PozoConaguaPageRoutingModule
  ],
  declarations: [PozoConaguaPage]
})
export class PozoConaguaPageModule {}
