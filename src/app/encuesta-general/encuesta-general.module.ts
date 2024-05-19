import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncuestaGeneralPageRoutingModule } from './encuesta-general-routing.module';

import { EncuestaGeneralPage } from './encuesta-general.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncuestaGeneralPageRoutingModule
  ],
  declarations: [EncuestaGeneralPage]
})
export class EncuestaGeneralPageModule {}
