import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { Platform } from '@ionic/angular';
//import { VideoPlayer } from '@ionic-native/video-player/ngx';
declare var HKVideoPlayer;

@Component({
  selector: 'app-video-presentacion',
  templateUrl: './video-presentacion.page.html',
  styleUrls: ['./video-presentacion.page.scss'],
})
export class VideoPresentacionPage implements OnInit {


  constructor(
    private streamingMedia: StreamingMedia,
    private platform: Platform,
    private router: Router
    //private videoPlayer: VideoPlayer
  ) {

  }


  ngOnInit() {
    this.platform.ready().then(() => {
      this.reproducirVideo().then( () => {
        this.router.navigateByUrl('home');
      });
    });
  }

  reproducirVideo() {

    // setTimeout(function(){ 
    //   this.router.navigateByUrl('home'); 
    // }, 14000);

    // console.log("Reproduciendo video");
    // let options: StreamingVideoOptions = {
    //   successCallback: () => { console.log('Video played') },
    //   errorCallback: (e) => { 
    //     console.log('Error streaming');
    //     this.router.navigateByUrl('home');  
    //   },
    //   orientation: 'portrait',
    //   shouldAutoClose: true,
    //   controls: false
    // };

    // this.streamingMedia.playVideo('https://sero.s3.us-east-2.amazonaws.com/presentacion.mp4', options);
    // //this.streamingMedia.playVideo('../../assets/img/presentacion.mp4', options);
    return Promise.resolve(HKVideoPlayer.playLocal("presentacion.mp4"));
    

  }


}
