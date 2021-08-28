import { Component, OnInit } from '@angular/core';
import { Storage } from "@ionic/storage";
import { MessagesService } from '../services/messages.service';
import { ModalController, Platform, LoadingController, NavController } from '@ionic/angular';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { RestService } from '../services/rest.service';
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Router } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';


@Component({
  selector: 'app-gestion-carta',
  templateUrl: './gestion-carta.page.html',
  styleUrls: ['./gestion-carta.page.scss'],
})
export class GestionCartaPage implements OnInit {

  imgs: any;
  account: string;
  infoAccount: any = [];
  personaAtiende: string = '';
  numeroContacto: string = '';
  idMotivoNoPago: number = 0;
  idTrabajoActual: number = 0;
  idGastoImpuesto: number = 0;
  idTipoServicio: number = 0;
  numeroNiveles: number = 0;
  colorFachada: string = '';
  colorPuerta: string = '';
  idTipoPredio: number = 0;
  entreCalle1: string = '';
  entreCalle2: string = '';
  observaciones: string = '';
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
  fechaCaptura:any;
  detectedChanges: boolean = false;


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
    private callNumber: CallNumber
  ) {
    this.imgs = [{ imagen: "assets/img/imgs.png" }];
  }

  async ngOnInit() {
    this.tipo = await this.storage.get('tipo');
    await this.platform.ready();
    this.getInfoAccount();
    this.getPlaza();
    this.getFechaActual();
  }

  async getPlaza() {
    this.nombrePlaza = await this.storage.get('NombrePlazaActiva');
    this.id_plaza = await this.storage.get('IdPlazaActiva');
  }



  async getInfoAccount() {
    this.account = await this.storage.get("account");
    this.idAspUser = await this.storage.get('IdAspUser');
    // verificar que tipo es la cuenta si es de agua, predio, antenas o es otra cosa
    if (this.tipo == 'Agua') {
      this.infoAccount = await this.rest.getInfoAccountAgua(this.account);
    } else if (this.tipo == 'Predio') {
      this.infoAccount = await this.rest.getInfoAccountPredio(this.account);
    }
    this.idAccountSqlite = this.infoAccount[0].id;
    this.idTareaGestor = this.infoAccount[0].id_tarea;
    let gestionada = this.infoAccount[0].gestionada;
    this.tareaAsignada = this.infoAccount[0].tarea_asignada;
    this.tipoServicioPadron = this.infoAccount[0].tipoServicio;
    if (gestionada == 1) {
      this.mensaje.showAlert("Esta cuenta ya ha sido gestionada");
      // ya no es un modal, checar si meter un router
      this.modalController.dismiss();
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
    console.log(img);
    console.log(this.imgs);

    for (let i = 0; i < this.imgs.length; i++) {
      console.log(this.imgs[i].imagen);
      if (this.imgs[i].imagen == img) {
        this.imgs.splice(i, 1);
      } else {
        console.log("No hay coincidencias");
      }
    }
    //borrara la foto trayendo la imagen de la tabla y mandando a llamar al metodo delete del restservice
    this.infoImage = await this.rest.getImageLocal(img);
    console.log(this.infoImage[0]);
  }

  takePic(type) {
    let tipo;
    if (type == 1) {
      tipo = 'Fachada predio'
    } else if (type == 2) {
      tipo = 'Evidencia'
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
        console.log(rutaBase64, this.image);
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
          tipo
        );
      })
      .catch(error => {
        console.error(error);
      });

  }

  saveImage(id_plaza, nombrePlaza, image, accountNumber, fecha, rutaBase64, idAspuser, idTarea, tipo) {
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
        tipo
      )
      .then(res => {
        console.log(res);
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
          numero_contacto: this.numeroContacto,
          id_motivo_no_pago: this.idMotivoNoPago,
          id_trabajo_actual: this.idTrabajoActual,
          id_gasto_impuesto: this.idGastoImpuesto,
          id_tipo_servicio: this.idTipoServicio,
          numero_niveles: this.numeroNiveles,
          color_fachada: this.colorFachada,
          color_puerta: this.colorPuerta,
          referencia: this.referencia,
          id_tipo_predio: this.idTipoPredio,
          entre_calle1: this.entreCalle1,
          entre_calle2: this.entreCalle2,
          observaciones: this.observaciones,
          idAspUser: this.idAspUser,
          idTarea: this.tareaAsignada,
          fechaCaptura: this.fechaCaptura,
          latitud: this.latitud,
          longitud: this.longitud,
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
    console.log(data);
    this.detectedChanges = false;
    this.rest.gestionCartaInvitacion(data); 
  }

  exit() {
    this.router.navigateByUrl('home/tab2');
    // this.router.ngOnDestroy();
    // this.router.dispose();
  }

}