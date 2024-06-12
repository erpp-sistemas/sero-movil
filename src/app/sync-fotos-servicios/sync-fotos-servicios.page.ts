import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ImagePreviewPage } from '../image-preview/image-preview.page';
import { MessagesService } from '../services/messages.service';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-sync-fotos-servicios',
  templateUrl: './sync-fotos-servicios.page.html',
  styleUrls: ['./sync-fotos-servicios.page.scss'],
})
export class SyncFotosServiciosPage implements OnInit {

  infoImages:any;
  loading: HTMLIonLoadingElement;
  isSelected: boolean;
  contadorFotos: number = 0;
  totalFotos: number = 0;
  isHide: boolean = false


  constructor(
    private loadingCtrl: LoadingController,
    private mensaje: MessagesService,
    private modalCtrl: ModalController,
    private router: Router,
    private photoService: PhotoService
  ) { }

  async ngOnInit() {
    await this.getTotalFotos();
    await this.getInfo();
    console.log(this.infoImages);
  }

  async getInfo() {
    this.loading = await this.loadingCtrl.create({
      message: 'Cargando las fotos...'
    });

    this.loading.present();

    this.infoImages = await this.photoService.getImagesLocalServicios();

    if (this.infoImages.length == 0) {
      this.mensaje.showAlert("No tienes fotos a sincronizar");
      this.router.navigateByUrl('sincronizar-fotos');
    }

    this.loading.dismiss();
  }

  async getTotalFotos() {
    this.totalFotos = await this.photoService.getTotalFotosServicios();
    console.log("Total fotos servicios" + this.totalFotos);
  }


  syncFotos() {
    this.photoService.uploadPhotosServicios().then(() => {
      console.log("Se mandaron las fotos");
      this.router.navigateByUrl('/sincronizar-fotos');
    })
  }

  uploadPhoto(id) {

  }

  deletePhoto( id, rutaBase64) {

  }


  openPreview(imagen) {
    this.modalCtrl.create({
      component: ImagePreviewPage,
      componentProps: {
        imagen
      }
    }).then( modal => {
      modal.present();
    });
  }


}
