import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActionsHistoryPageRoutingModule } from './actions-history-routing.module';

import { ActionsHistoryPage } from './actions-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActionsHistoryPageRoutingModule
  ],
  declarations: [ActionsHistoryPage]
})
export class ActionsHistoryPageModule {}
