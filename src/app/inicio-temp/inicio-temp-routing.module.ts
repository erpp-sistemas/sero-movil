import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicioTempPage } from './inicio-temp.page';

const routes: Routes = [
  {
    path: '',
    component: InicioTempPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioTempPageRoutingModule {}
