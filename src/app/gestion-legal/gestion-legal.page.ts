import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from "@ionic/storage";
import { MessagesService } from '../services/messages.service';
import { ModalController, Platform, LoadingController, NavController, AlertController } from '@ionic/angular';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { RestService } from '../services/rest.service';
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { PhotosHistoryPage } from '../photos-history/photos-history.page';

@Component({
  selector: 'app-gestion-legal',
  templateUrl: './gestion-legal.page.html',
  styleUrls: ['./gestion-legal.page.scss'],
})
export class GestionLegalPage implements OnInit {

  account: string = "";
  propietario: string = "";
  imgs: any;
  personaAtiende: string = '';
  //numeroContacto: string = '';
  idPuesto: number = 0;
  otroPuesto: string = '';
  idMotivoNoPago: number = 0;
  otroMotivo: string = '';
  idTipoServicio: number = 0;
  numeroNiveles: number = 1;
  colorFachada: string = '';
  colorPuerta: string = '';
  referencia: string = '';
  idTipoPredio: number;
  entreCalle1: string = '';
  entreCalle2: string = '';
  observaciones: string = '';
  lectura_medidor: string = '';
  tipoServicioPadron: string = '';

  latitud: number;
  longitud: number;
  fechaCaptura: string = "";
  idAspUser: string = "";
  idTareaGestor: number = 0;
  fechaActual: string;
  g: any;
  t: any;
  infoAccount: any[];
  image: string = "";
  isPhoto: boolean = false;
  isMotive: boolean = false;
  tareaAsignada: string;
  idAccountSqlite: number;
  loading: any;
  userInfo: any;
  indicadorImagen: number = 0;
  infoImage: any[];
  takePhoto: boolean = false;
  activaOtroMotivo: boolean = false;
  detectedChanges: boolean = false;

  giro: string = '';
  mostrarGiro: boolean = false;
  plazaAgua: boolean;

  nombrePlaza: any;
  id_plaza: any;
  idServicioPlaza: number = 0;
  mostrarOtroPuesto: boolean = false;


  sliderOpts = {
    zoom: true,
    slidesPerView: 1.55,
    spaceBetween: 10,
    centeredSlides: true
  };

  constructor(
    private storage: Storage,
    private router: Router,
    private mensaje: MessagesService,
    private geolocation: Geolocation,
    private modalController: ModalController,
    private platform: Platform,
    private loadingController: LoadingController,
    private rest: RestService,
    private camera: Camera,
    private webview: WebView,
    private navCtrl: NavController,
    private callNumber: CallNumber,
    private alertCtrl: AlertController
  ) {
    this.imgs = [{ imagen: "assets/img/imgs.png" }];
  }

  async ngOnInit() {
    await this.platform.ready();
    this.getInfoAccount();
    this.getPlaza();
    this.getFechaActual();
    this.idServicioPlaza = await this.storage.get('IdServicioActivo');
    this.estatusLecturaMedidor();

  }

  async estatusLecturaMedidor() {
    if (this.idServicioPlaza === 1) {
      this.plazaAgua = true;
    } else {
      this.plazaAgua = false;
    }
  }

  ionViewWillLeave() {
    if (this.detectedChanges) {
      this.mensaje.showAlert(
        "La gestión no se guardará, tendras que capturar de nuevo"
      );
    }
  }

  async getPlaza() {
    this.nombrePlaza = await this.storage.get('NombrePlazaActiva');
    this.id_plaza = await this.storage.get('IdPlazaActiva');
  }


  async getInfoAccount() {
    this.account = await this.storage.get("account");
    // console.log("Cuenta guardada en el storage " + this.account);
    this.idAspUser = await this.storage.get("IdAspUser");
    this.infoAccount = await this.rest.getInfoAccount(this.account);
    this.propietario = this.infoAccount[0].propietario;
    this.idAccountSqlite = this.infoAccount[0].id;
    this.tareaAsignada = this.infoAccount[0].tarea_asignada;
    this.tipoServicioPadron = this.infoAccount[0].tipo_servicio;
    let gestionada = this.infoAccount[0].gestionada;
    if (gestionada == 1) {
      this.mensaje.showAlert("Esta cuenta ya ha sido gestionada");
      this.router.navigateByUrl('home/tab2');
    }
  }

  getFechaActual() {
    var dateDay = new Date().toISOString();
    let date: Date = new Date(dateDay);
    let ionicDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );

    this.fechaActual = ionicDate.toISOString();
    let fecha = this.fechaActual.split("T");
  }

  resultIdPuesto(event) {
    let opcion = event.detail.value;
    if (opcion == 6) {
      this.mostrarOtroPuesto = true;
    } else {
      this.mostrarOtroPuesto = false;
    }
  }

  resultTipoServicio(event) {
    let tipo = event.detail.value;
    if(tipo !== '8') {
      this.mostrarGiro = true;
    } else {
      this.mostrarGiro = false;
    }
  }

  resultMotivoNoPago(event) {
    let motivo = event.detail.value;
    if (motivo == 5) {
      this.activaOtroMotivo = true;
    } else {
      this.activaOtroMotivo = false;
    }
  }


  async confirmaFoto(tipo: number) {
    const mensaje = await this.alertCtrl.create({
      header: "Tomar foto",
      subHeader: "Selecciona el modo para tomar foto ",
      buttons: [
        {
          text: "Camara",
          cssClass: "secondary",
          handler: () => {
            this.takePic(tipo);
          }
        },
        {
          text: "Galeria",
          cssClass: "secondary",
          handler: () => {
            this.takePicGallery(tipo)
          }
        }
      ]
    });
    await mensaje.present();
  }


  takePic(type) {
    let tipo;
    if (type == 1) {
      tipo = "Legal fachada predio"
    } else if (type == 2) {
      tipo = "Legal evidencia";
    } else if (type == 3) {
      tipo = "Legal toma"
    }
    var dateDay = new Date().toISOString();
    let date: Date = new Date(dateDay);
    let ionicDate = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      )
    );

    let fecha = ionicDate.toISOString();

    let options: CameraOptions = {
      quality: 40,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options)
      .then(imageData => {
        this.indicadorImagen = this.indicadorImagen + 1;
        let rutaBase64 = imageData;
        this.image = this.webview.convertFileSrc(imageData);
        this.isPhoto = false;
        this.takePhoto = true;
        this.imgs.push({ imagen: this.image });
        if (this.indicadorImagen == 1) {
          this.imgs.splice(0, 1)
        }

        this.saveImage(
          this.id_plaza,
          this.nombrePlaza,
          this.image,
          this.account,
          fecha,
          rutaBase64,
          this.idAspUser,
          this.tareaAsignada,
          tipo,
          this.idServicioPlaza
        );
      }).catch(error => console.log(error));

  }

  takePicGallery(type) {
    let tipo;
    if (type == 1) {
      tipo = "Legal fachada predio"
    } else if (type == 2) {
      tipo = "Legal evidencia";
    } else if (type == 3) {
      tipo = "Legal toma"
    }

    var dateDay = new Date().toISOString();
    let date: Date = new Date(dateDay);
    let ionicDate = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      )
    );

    let fecha = ionicDate.toISOString();

    let options: CameraOptions = {
      quality: 40,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options)
      .then(imageData => {
        this.indicadorImagen = this.indicadorImagen + 1;
        let rutaBase64 = imageData;
        this.image = this.webview.convertFileSrc(imageData);
        this.isPhoto = false;
        this.takePhoto = true;
        this.imgs.push({ imagen: this.image });
        if (this.indicadorImagen == 1) {
          this.imgs.splice(0, 1)
        }

        this.saveImage(
          this.id_plaza,
          this.nombrePlaza,
          this.image,
          this.account,
          fecha,
          rutaBase64,
          this.idAspUser,
          this.tareaAsignada,
          tipo,
          this.idServicioPlaza
        );
      }).catch(error => console.log(error));

  }

  saveImage(id_plaza, nombrePlaza, image, accountNumber, fecha, rutaBase64, idAspUser, idTarea, tipo, idServicioPlaza) {
    this.rest.saveImage(
      id_plaza,
      nombrePlaza,
      image,
      accountNumber,
      fecha,
      rutaBase64,
      idAspUser,
      idTarea,
      tipo,
      idServicioPlaza
    ).then(res => {
      //console.log(res);
      this.mensaje.showToast("Se almaceno la imagen correctamente");
    })
  }



  async verify() {
    let account = this.account;
    this.loading = await this.loadingController.create({
      message: "Obteniendo la ubicación de esta gestión y guardando..."
    });
    await this.loading.present();

    this.geolocation.getCurrentPosition().then(async (resp) => {
      if (resp) {
        this.latitud = resp.coords.latitude;
        this.longitud = resp.coords.longitude;
        this.loading.dismiss();

        this.loading = await this.loadingController.create({
          message: 'Guardando la gestión...'
        });

        await this.loading.present();

        var dateDay = new Date().toISOString();
        let date: Date = new Date(dateDay);
        let ionicDate = new Date(
          Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
          )
        );

        this.fechaCaptura = ionicDate.toISOString();

        let data = {
          id_plaza: this.id_plaza,
          nombrePlaza: this.nombrePlaza,
          account: this.account,
          personaAtiende: this.personaAtiende,
          //numeroContacto: this.numeroContacto, se quito para la app de encuesta
          idPuesto: this.idPuesto,
          otroPuesto: this.otroPuesto,
          idMotivoNoPago: this.idMotivoNoPago,
          otroMotivo: this.otroMotivo,
          idTipoServicio: this.idTipoServicio,
          numeroNiveles: this.numeroNiveles,
          colorFachada: this.colorFachada,
          colorPuerta: this.colorPuerta,
          referencia: this.referencia,
          idTipoPredio: this.idTipoPredio,
          entreCalle1: this.entreCalle1,
          entreCalle2: this.entreCalle2,
          observaciones: this.observaciones,
          lectura_medidor: this.lectura_medidor,
          giro: this.giro,
          idAspUser: this.idAspUser,
          idTarea: this.tareaAsignada,
          fechaCaptura: this.fechaCaptura,
          latitud: this.latitud,
          longitud: this.longitud,
          idServicioPlaza: this.idServicioPlaza,
          id: this.idAccountSqlite
        };

        await this.gestionLegal(data);
        this.loading.dismiss();
        this.exit();
      }
    }).catch(error => {
      this.loading.dismiss();
      console.log(error);
      this.mensaje.showAlert("Hubo un problema al realizar la gestión!!!!")
    })
  }

  async gestionLegal(data) {
    this.detectedChanges = false;
    await this.rest.gestionLegal(data);
  }

  exit() {
    this.navCtrl.navigateRoot(['/home/tab2']);
  }

  async deletePhoto(img) {
    // console.log(img);
    // console.log(this.imgs);

    for (let i = 0; i < this.imgs.length; i++) {
      // console.log(this.imgs[i].imagen);
      if (this.imgs[i].imagen == img) {
        this.imgs.splice(i, 1);
      }
    }
    //borrara la foto trayendo la imagen de la tabla y mandando a llamar al metodo delete del restservice
    this.infoImage = await this.rest.getImageLocal(img);
    //console.log(this.infoImage[0]);
  }


  async salida(tipo) {
    const alert = await this.alertCtrl.create({
      header: "Salir",
      subHeader: "Confirme para salir de la gestión, se perderan los cambios ",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary",
          handler: blah => { }
        },
        {
          text: "Confirmar",
          cssClass: "secondary",
          handler: () => {
            this.navegar(tipo)
          }
        }
      ]
    });
    await alert.present();
  }



  async goPhotos() {

    let idPlaza = this.id_plaza;

    const modal = await this.modalController.create({
      component: PhotosHistoryPage,
      componentProps: {
        "account": this.account,
        "idPlaza": idPlaza
      }
    });

    await modal.present();

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

      this.callNumber.callNumber('18001010101', true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));

    }
  }


}
