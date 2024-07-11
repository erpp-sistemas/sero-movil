import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from './header/header.component';


// callNumber
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SelectPartidosComponent } from './select-partidos/select-partidos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardNivelConocimientoComponent } from './card-nivel-conocimiento/card-nivel-conocimiento.component';
import { CardAprobacionAutoridadesComponent } from './card-aprobacion-autoridades/card-aprobacion-autoridades.component';
import { CardPreferenciaElectoralComponent } from './card-preferencia-electoral/card-preferencia-electoral.component';
import { SegmentTabBarComponent } from './segment-tab-bar/segment-tab-bar.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';



@NgModule({
  declarations: [
    HeaderComponent,
    SelectPartidosComponent,
    CardNivelConocimientoComponent,
    CardAprobacionAutoridadesComponent,
    CardPreferenciaElectoralComponent,
    SegmentTabBarComponent,
    DynamicFormComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    HeaderComponent,
    SelectPartidosComponent,
    CardNivelConocimientoComponent,
    CardAprobacionAutoridadesComponent,
    CardPreferenciaElectoralComponent,
    SegmentTabBarComponent,
    DynamicFormComponent
  ],
  providers: [
    CallNumber
  ]
})
export class ComponentsModule { }
