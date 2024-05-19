import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EncuestaGeneralPage } from './encuesta-general.page';

const routes: Routes = [
  {
    path: '',
    component: EncuestaGeneralPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EncuestaGeneralPageRoutingModule {}
