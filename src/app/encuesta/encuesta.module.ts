import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncuestaPageRoutingModule } from './encuesta-routing.module';

import { EncuestaPage } from './encuesta.page';
import { ComponentsModule } from "../components/components.module";

@NgModule({
    declarations: [EncuestaPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        EncuestaPageRoutingModule,
        ComponentsModule
    ]
})
export class EncuestaPageModule {}
