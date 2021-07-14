import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PozoConaguaPage } from './pozo-conagua.page';

const routes: Routes = [
  {
    path: '',
    component: PozoConaguaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PozoConaguaPageRoutingModule {}
