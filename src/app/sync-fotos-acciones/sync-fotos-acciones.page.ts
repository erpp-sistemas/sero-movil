import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ImagePreviewPage } from '../image-preview/image-preview.page';
import { MessagesService } from '../services/messages.service';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { PhotoService } from '../services/photo.service';


@Component({
  selector: 'app-sync-fotos-acciones',
  templateUrl: './sync-fotos-acciones.page.html',
  styleUrls: ['./sync-fotos-acciones.page.scss'],
})
export class SyncFotosAccionesPage implements OnInit {

  infoImages: any;
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
    private network: Network,
    private photoService: PhotoService,
  ) { }

  async ngOnInit() {
    console.log(this.network.type);
    await this.getTotalFotos();
    await this.getInfo();
    console.log(this.infoImages);
  }


  async getInfo() {
    this.loading = await this.loadingCtrl.create({
      message: 'Cargando las fotos...'
    });

    this.loading.present();

    this.infoImages = await this.photoService.getImagesLocal();

    if (this.infoImages.length == 0) {
      this.mensaje.showAlert("No tienes fotos a sincronizar");
      this.router.navigateByUrl('sincronizar-fotos');
    }

    this.loading.dismiss();
  }

  async getTotalFotos() {
    this.totalFotos = await this.photoService.getTotalFotosAcciones();
    console.log("Fotos acciones ", this.totalFotos);
  }

  openPreview(imagen) {
    console.log(imagen);
    this.modalCtrl.create({
      component: ImagePreviewPage,
      componentProps: {
        imagen
      }
    }).then(modal => {
      modal.present();
    });
  }

  async uploadPhoto(id) {
    const loading = await this.loadingCtrl.create({
      message: 'Enviando foto...',
      spinner: 'dots'
    });
    await loading.present();
    this.photoService.uploadPhoto(id).then(async res => {
      if(!res) {
        loading.dismiss();
        this.mensaje.showAlert("La foto ya no se encuentra en el dispositivo...")
      }
      this.getInfo();
      await this.getTotalFotos();
      loading.dismiss();
    })
  }

  async deletePhoto(id, rutaBase64) {
    const loading = await this.loadingCtrl.create({
      message: 'Eliminando la foto...',
      spinner: 'dots'
    });
    loading.present();
    this.photoService.deletePhoto(id, rutaBase64);
    this.getInfo();
    await this.getTotalFotos();
    loading.dismiss();
  }

  syncFotos() {
    let typeNetwork = this.network.type;
    console.log(typeNetwork);
    if (typeNetwork !== 'wifi') {
      this.mensaje.showToastLarge("No estas conectado a una red wifi, recuerda que se recomienda enviar tus fotos con wifi")
    }
    this.photoService.uploadPhotos().then(() => {
      this.router.navigateByUrl('/sincronizar-fotos');
    })
  }


}
