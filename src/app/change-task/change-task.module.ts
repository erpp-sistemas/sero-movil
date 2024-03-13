import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangeTaskPageRoutingModule } from './change-task-routing.module';

import { ChangeTaskPage } from './change-task.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangeTaskPageRoutingModule
  ],
  declarations: [ChangeTaskPage]
})
export class ChangeTaskPageModule {}
