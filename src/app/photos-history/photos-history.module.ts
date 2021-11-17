import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PhotosHistoryPageRoutingModule } from './photos-history-routing.module';

import { PhotosHistoryPage } from './photos-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PhotosHistoryPageRoutingModule
  ],
  declarations: [PhotosHistoryPage]
})
export class PhotosHistoryPageModule {}
