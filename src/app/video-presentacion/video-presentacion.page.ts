import { Component, OnInit } from '@angular/core';
//import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { ModalController, Platform } from '@ionic/angular';
//import { VideoPlayer } from '@ionic-native/video-player/ngx';




@Component({
  selector: 'app-video-presentacion',
  templateUrl: './video-presentacion.page.html',
  styleUrls: ['./video-presentacion.page.scss'],
})
export class VideoPresentacionPage implements OnInit {


  constructor(
    private platform: Platform,
    private modalCtrl: ModalController
    //private videoPlayer: VideoPlayer
  ) {

  }


  ngOnInit() {
    this.platform.ready().then(() => {
      setTimeout(() => {
        this.modalCtrl.dismiss();
      }, 10000);
    });
  }

  


}
