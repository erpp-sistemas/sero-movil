import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChartCoordinatorPageRoutingModule } from './chart-coordinator-routing.module';

import { ChartCoordinatorPage } from './chart-coordinator.page';

import { NgChartsModule } from 'ng2-charts';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChartCoordinatorPageRoutingModule,
    NgChartsModule
  ],
  declarations: [ChartCoordinatorPage]
})
export class ChartCoordinatorPageModule {}
