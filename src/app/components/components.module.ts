import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from './header/header.component';


// callNumber
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SelectPartidosComponent } from './select-partidos/select-partidos.component';
import { FormsModule } from '@angular/forms';
import { CardNivelConocimientoComponent } from './card-nivel-conocimiento/card-nivel-conocimiento.component';
import { CardAprobacionAutoridadesComponent } from './card-aprobacion-autoridades/card-aprobacion-autoridades.component';
import { CardPreferenciaElectoralComponent } from './card-preferencia-electoral/card-preferencia-electoral.component';



@NgModule({
  declarations: [
    HeaderComponent,
    SelectPartidosComponent,
    CardNivelConocimientoComponent,
    CardAprobacionAutoridadesComponent,
    CardPreferenciaElectoralComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [
    HeaderComponent,
    SelectPartidosComponent,
    CardNivelConocimientoComponent,
    CardAprobacionAutoridadesComponent,
    CardPreferenciaElectoralComponent
  ],
  providers: [
    CallNumber
  ]
})
export class ComponentsModule { }
