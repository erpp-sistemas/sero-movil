import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListadoCuentasPageRoutingModule } from './listado-cuentas-routing.module';

import { ListadoCuentasPage } from './listado-cuentas.page';

import { FiltroPipe } from '../pipes/filtro.pipe';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListadoCuentasPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ListadoCuentasPage, FiltroPipe]
})
export class ListadoCuentasPageModule {}
