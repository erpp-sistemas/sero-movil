import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PushNotificationsPageRoutingModule } from './push-notifications-routing.module';

import { PushNotificationsPage } from './push-notifications.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PushNotificationsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PushNotificationsPage]
})
export class PushNotificationsPageModule {}
