import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DirectorioPageRoutingModule } from './directorio-routing.module';

import { DirectorioPage } from './directorio.page';
import { ComponentsModule } from '../components/components.module';
// callNumber
import { CallNumber } from '@ionic-native/call-number/ngx';
import { EmpleadoPipe } from '../pipes/empleado.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DirectorioPageRoutingModule,
    ComponentsModule
  ],
  declarations: [DirectorioPage, EmpleadoPipe],
  providers: [
    CallNumber
  ]
})
export class DirectorioPageModule {}
