import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideoPresentacionPage } from './video-presentacion.page';

const routes: Routes = [
  {
    path: '',
    component: VideoPresentacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoPresentacionPageRoutingModule {}
