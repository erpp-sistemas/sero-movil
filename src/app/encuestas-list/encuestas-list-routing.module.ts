import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EncuestasListPage } from './encuestas-list.page';

const routes: Routes = [
  {
    path: '',
    component: EncuestasListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EncuestasListPageRoutingModule {}
