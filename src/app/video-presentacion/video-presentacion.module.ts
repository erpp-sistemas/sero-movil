import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideoPresentacionPageRoutingModule } from './video-presentacion-routing.module';

import { VideoPresentacionPage } from './video-presentacion.page';
//import { VideoPlayer } from '@ionic-native/video-player/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideoPresentacionPageRoutingModule
  ],
  providers: [
    //VideoPlayer
  ],
  declarations: [VideoPresentacionPage]
})
export class VideoPresentacionPageModule {}
