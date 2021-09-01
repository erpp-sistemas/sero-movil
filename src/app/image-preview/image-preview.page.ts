import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.page.html',
  styleUrls: ['./image-preview.page.scss'],
})
export class ImagePreviewPage implements OnInit {

  @ViewChild('slider', { read: ElementRef })slider: ElementRef;
  img: any;
 
  sliderOpts = {
    zoom: {
      maxRatio: 7
    }
  };


  constructor(
    private navParams: NavParams, 
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.img = this.navParams.get('imagen');
    console.log("imagen");
    console.log(this.img);
  }

  close() {
    this.modalController.dismiss();
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
