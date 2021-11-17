import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhotosHistoryPage } from './photos-history.page';

const routes: Routes = [
  {
    path: '',
    component: PhotosHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhotosHistoryPageRoutingModule {}
