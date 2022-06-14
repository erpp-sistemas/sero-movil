import { Component, OnInit } from '@angular/core';
import { Storage } from "@ionic/storage";
import { MessagesService } from '../services/messages.service';
import { ModalController, Platform, LoadingController, NavController, AlertController } from '@ionic/angular';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { RestService } from '../services/rest.service';
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Router } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { PhotosHistoryPage } from '../photos-history/photos-history.page';
import { EncuestaPage } from '../encuesta/encuesta.page';


@Component({
  selector: 'app-gestion-carta',
  templateUrl: './gestion-carta.page.html',
  styleUrls: ['./gestion-carta.page.scss'],
})
export class GestionCartaPage implements OnInit {

  imgs: any;
  account: string;
  propietario: string = "";
  infoAccount: any = [];
  personaAtiende: string = '';
  // numeroContacto: string = '';
  // idMotivoNoPago: number = 0;
  // idTrabajoActual: number = 0;
  // idGastoImpuesto: number = 0;
  idTipoServicio: number = 0;
  numeroNiveles: number = 1;
  colorFachada: string = '';
  colorPuerta: string = '';
  idTipoPredio: number = 0;
  entreCalle1: string = '';
  entreCalle2: string = '';
  observaciones: string = '';
  lectura_medidor: string = '';
  tipoServicioPadron: string = '';
  referencia: string = '';

  idAspUser: string = '';
  idTarea: number = 0;
  latitud: number;
  longitud: number;
  nombrePlaza: any;
  id_plaza: any;
  tipo: any;
  idAccountSqlite: any;
  idTareaGestor: any;
  gestionada: number;
  tareaAsignada: number = 0;
  fechaActual: any;
  infoImage: any = [];
  takePhoto: boolean = false;
  indicadorImagen: number = 0;
  isPhoto: boolean = false;
  image: string = '';
  loading: any;
  fechaCaptura: any;
  detectedChanges: boolean = false;
  tipoServicio: number = 0;
  idServicioPlaza: number = 0;
  giro: string = '';

  activaOtroMotivo: boolean = false;
  otroMotivo: string = '';

  encuestaRealizada: boolean = false;
  plazaAgua: boolean;
  mostrarGiro: boolean = false;


  sliderOpts = {
    zoom: true,
    slidesPerView: 1.55,
    spaceBetween: 10,
    centeredSlides: true
  };

  constructor(
    private storage: Storage,
    private mensaje: MessagesService,
    private geolocation: Geolocation,
    private modalController: ModalController,
    private platform: Platform,
    private loadingController: LoadingController,
    private rest: RestService,
    private camera: Camera,
    private webview: WebView,
    private navController: NavController,
    private router: Router,
    private callNumber: CallNumber,
    private alertCtrl: AlertController
  ) {
    this.imgs = [{ imagen: "assets/img/imgs.png" }];
  }

  async ngOnInit() {
    this.tipo = await this.storage.get('IdServicioActivo');
    await this.platform.ready();
    this.getInfoAccount();
    this.getPlaza();
    this.getFechaActual();
    this.estatusLecturaMedidor();
    this.idServicioPlaza = await this.storage.get('IdServicioActivo');
  }

  async estatusLecturaMedidor() {
    if(this.tipo === 1) {
      this.plazaAgua = true;
    } else {
      this.plazaAgua = false;
    }
  }

  async getPlaza() {
    this.nombrePlaza = await this.storage.get('NombrePlazaActiva');
    this.id_plaza = await this.storage.get('IdPlazaActiva');
  }

  async getInfoAccount() {
    this.account = await this.storage.get("account");
    this.idAspUser = await this.storage.get('IdAspUser');
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
    this.fechaActual = fecha[0];

  }

  async deletePhoto(img) {
    // console.log(img);
    // console.log(this.imgs);

    for (let i = 0; i < this.imgs.length; i++) {
      //console.log(this.imgs[i].imagen);
      if (this.imgs[i].imagen == img) {
        this.imgs.splice(i, 1);
      }
    }
    //borrara la foto trayendo la imagen de la tabla y mandando a llamar al metodo delete del restservice
    this.infoImage = await this.rest.getImageLocal(img);
    // console.log(this.infoImage[0]);
  }


  async confirmarFoto(tipo: number) {
    const mensaje = await this.alertCtrl.create({
      header: "Tomar foto",
      subHeader: "Selecciona como tomar la foto ",
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
      tipo = 'Carta invitación fachada predio'
    } else if (type == 2) {
      tipo = 'Carta invitación evidencia'
    } else if (type == 3) {
      tipo = 'Carta invitación toma'
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
    this.camera
      .getPicture(options)
      .then(imageData => {
        this.indicadorImagen = this.indicadorImagen + 1;
        let rutaBase64 = imageData;
        this.image = this.webview.convertFileSrc(imageData);
        // console.log(rutaBase64, this.image);
        this.isPhoto = false;
        this.takePhoto = true;
        this.imgs.push({ imagen: this.image });
        if (this.indicadorImagen == 1) {
          this.imgs.splice(0, 1);
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
      })
      .catch(error => {
        console.error(error);
      });

  }

  takePicGallery(type) {
    let tipo;
    if (type == 1) {
      tipo = 'Carta invitación fachada predio'
    } else if (type == 2) {
      tipo = 'Carta invitación evidencia'
    } else if (type == 3) {
      tipo = 'Carta invitación toma'
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
    this.camera
      .getPicture(options)
      .then(imageData => {
        this.indicadorImagen = this.indicadorImagen + 1;
        let rutaBase64 = imageData;
        this.image = this.webview.convertFileSrc(imageData);
        // console.log(rutaBase64, this.image);
        this.isPhoto = false;
        this.takePhoto = true;
        this.imgs.push({ imagen: this.image });
        if (this.indicadorImagen == 1) {
          this.imgs.splice(0, 1);
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
      })
      .catch(error => {
        console.error(error);
      });

  }

  saveImage(id_plaza, nombrePlaza, image, accountNumber, fecha, rutaBase64, idAspuser, idTarea, tipo, idServicioPlaza) {
    this.rest
      .saveImage(
        id_plaza,
        nombrePlaza,
        image,
        accountNumber,
        fecha,
        rutaBase64,
        idAspuser,
        idTarea,
        tipo,
        idServicioPlaza
      )
      .then(res => {
        this.mensaje.showToast("Se almacenó la imagen correctamente");
      });
  }

  async terminar() {
    let account = this.account;

    this.loading = await this.loadingController.create({
      message: 'Obteniendo la ubicación de esta gestión'
    });

    await this.loading.present();


    this.geolocation.getCurrentPosition().then(async (resp) => {
      if (resp) {
        this.latitud = resp.coords.latitude;
        this.longitud = resp.coords.longitude;
        this.loading.dismiss();

        this.loading = await this.loadingController.create({
          message: 'Guardando la gestión'
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
          persona_atiende: this.personaAtiende,
          //numero_contacto: this.numeroContacto,
          //id_motivo_no_pago: this.idMotivoNoPago, // No se estan utilizando va a estar en app de encuesta
          //otro_motivo_no_pago: this.otroMotivo, // No se estan utilizando va a estar en app de encuesta
          //id_trabajo_actual: this.idTrabajoActual, // No se estan utilizando va a estar en app de encuesta
          //id_gasto_impuesto: this.idGastoImpuesto, // No se estan utilizando va a estar en app de encuesta
          id_tipo_servicio: this.idTipoServicio,
          numero_niveles: this.numeroNiveles,
          colorFachada: this.colorFachada,
          colorPuerta: this.colorPuerta,
          referencia: this.referencia,
          id_tipo_predio: this.idTipoPredio,
          entre_calle1: this.entreCalle1,
          entre_calle2: this.entreCalle2,
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
        }
        
        await this.gestionCarta(data);
        this.loading.dismiss();
        this.exit();

      }
    }).catch(async (error) => {
      this.loading.dismiss();
      this.mensaje.showAlert("No se pudo obtener la geolocalización, verifica GPS");
    })
  }


  async gestionCarta(data) {
    // console.log(data);
    this.detectedChanges = false;
    this.rest.gestionCartaInvitacion(data);
  }

  exit() {
    this.router.navigateByUrl('home/tab2');
  }

  resultPersonaAtiende(event) {
    this.detectedChanges = true;
  }

  resultNumeroContacto(event) {
    this.detectedChanges = true;
  }

  resultTipoServicio( event ) {
    let tipo = event.detail.value;
    if(tipo !== "8") {
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


  async salida(tipo) {
    const alert = await this.alertCtrl.create({
      header: "Salir",
      subHeader: "Confirme para salir de la gestión, se perderan los cambios ",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary",
          handler: blah => {}
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

  async encuesta() {

    let idPlaza = this.id_plaza;

    const modal = await this.modalController.create({
      component: EncuestaPage,
      componentProps: {
        "account": this.account,
        "idPlaza": idPlaza,
        "idServicioPlaza": this.idServicioPlaza
      }
    });

    await modal.present();

    const data = await modal.onDidDismiss();

    let resultadoEncuesta = data.data.estatus;

    if(resultadoEncuesta === 'Realizado') this.encuestaRealizada = true;

  }


}
