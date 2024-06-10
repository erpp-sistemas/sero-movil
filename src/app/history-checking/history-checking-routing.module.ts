import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoryCheckingPage } from './history-checking.page';

const routes: Routes = [
  {
    path: '',
    component: HistoryCheckingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoryCheckingPageRoutingModule {}
