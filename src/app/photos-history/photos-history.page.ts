import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { MessagesService } from '../services/messages.service';
import { RestService } from '../services/rest.service';

@Component({
  selector: 'app-photos-history',
  templateUrl: './photos-history.page.html',
  styleUrls: ['./photos-history.page.scss'],
})
export class PhotosHistoryPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private rest: RestService,
    private message: MessagesService,
    private loadingCtrl: LoadingController
  ) { }

  @Input() idPlaza;
  @Input() account;

  @ViewChild('slider', { read: ElementRef })slider: ElementRef;
  imgs: any;
 
  sliderOpts = {
    zoom: {
      maxRatio: 7
    }
  };


  ngOnInit() {
    console.log(this.idPlaza);
    console.log(this.account);
    this.getPhotosInfo();
  }

  async getPhotosInfo() {
    // this.rest.getPhotosHistory(this.idPlaza, this.account).then( data => {
    //   console.log(data);
    //   this.imgs = data;
    // })

    const loading = await this.loadingCtrl.create({
      message: 'Cargando las fotos...',
      spinner: 'dots'
    });

    await loading.present();

    this.imgs = await this.rest.getPhotosHistory(this.idPlaza, this.account);

    if(this.imgs.length == 0) {
      this.message.showAlert("Esta cuenta aún no tiene fotos!!!!");
      loading.dismiss();
      this.modalCtrl.dismiss();
    }

    loading.dismiss();

  }

  close() {
    this.modalCtrl.dismiss();
  }


  zoom(zoomIn: boolean) {
    let zoom = this.slider.nativeElement.swiper.zoom;
    if (zoomIn) {
      zoom.in();
    } else {
      zoom.out();
    }
  }

}
