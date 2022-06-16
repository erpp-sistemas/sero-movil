import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ImagePreviewPage } from '../image-preview/image-preview.page';
import { MessagesService } from '../services/messages.service';
import { RestService } from '../services/rest.service';
import { CallNumber } from '@ionic-native/call-number/ngx';


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
    private rest: RestService,
    private loadingCtrl: LoadingController,
    private mensaje: MessagesService,
    private modalCtrl: ModalController,
    private router: Router,
    private callNumber: CallNumber
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

    this.infoImages = await this.rest.getImagesLocal();

    if (this.infoImages.length == 0) {
      this.mensaje.showAlert("No tienes fotos a sincronizar");
      this.router.navigateByUrl('sincronizar-fotos');
    }

    this.loading.dismiss();
  }

  async getTotalFotos() {
    this.totalFotos = await this.rest.getTotalFotosAcciones();
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

    await this.rest.uploadPhoto(id);
    this.getInfo();
    await this.getTotalFotos();

    loading.dismiss();

  }

  async deletePhoto(id, rutaBase64) {

    const loading = await this.loadingCtrl.create({
      message: 'Eliminando la foto...',
      spinner: 'dots'
    });

    loading.present();

    this.rest.deletePhoto(id, rutaBase64);
    this.getInfo();
    await this.getTotalFotos();

    loading.dismiss();

  }

  syncFotos() {
    this.rest.uploadPhotos().then(() => {
      console.log("Se mandaron las fotos");
      this.router.navigateByUrl('/sincronizar-fotos');
    })
  }

  navegar(tipo) {
    if (tipo == 1) {
      this.router.navigateByUrl('home/tab1');
    } else if (tipo == 2) {
      this.router.navigateByUrl('home/tab2');
    } else if (tipo == 3) {
      this.router.navigateByUrl('home/tab3');
    } else if (tipo == 4) {
      this.router.navigateByUrl('home/tab4');
    } else if (tipo == 5) {

      this.callNumber.callNumber('911', true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));

    }
  }

}
