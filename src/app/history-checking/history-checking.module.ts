import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoryCheckingPageRoutingModule } from './history-checking-routing.module';

import { HistoryCheckingPage } from './history-checking.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoryCheckingPageRoutingModule
  ],
  declarations: [HistoryCheckingPage]
})
export class HistoryCheckingPageModule {}
