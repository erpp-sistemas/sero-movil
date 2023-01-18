import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActionsHistoryPage } from './actions-history.page';

const routes: Routes = [
  {
    path: '',
    component: ActionsHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActionsHistoryPageRoutingModule {}
