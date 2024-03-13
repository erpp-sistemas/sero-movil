import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangeTaskPage } from './change-task.page';

const routes: Routes = [
  {
    path: '',
    component: ChangeTaskPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangeTaskPageRoutingModule {}
