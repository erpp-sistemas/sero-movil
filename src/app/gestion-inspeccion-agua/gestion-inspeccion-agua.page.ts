import { Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-gestion-inspeccion-agua',
  templateUrl: './gestion-inspeccion-agua.page.html',
  styleUrls: ['./gestion-inspeccion-agua.page.scss'],
})
export class GestionInspeccionAguaPage implements OnInit {

  account: string = "";
  propietario: string = "";
  personaAtiende: string = '';
  //numeroContacto: string = '';
  //puesto: string = '';
  idPuesto: number = 0;
  otroPuesto: string = '';
  idMotivoNoPago: number = 0;
  otroMotivo: string = '';
  idTipoServicio: number = 0
  numeroNiveles: number = 1;
  colorFachada: string = '';
  colorPuerta: string = '';
  referencia: string = '';
  idTipoPredio: number = 0;
  entreCalle1: string = '';
  entreCalle2: string = '';
  hallazgoNinguna: number = 0;
  hallazgoMedidorDescompuesto: number = 0;
  hallazgoDiferenciaDiametro: number = 0;
  hallazgoTomaClandestina: number = 0;
  hallazgoDerivacionClandestina: number = 0;
  hallazgoDrenajeClandestino: number = 0;
  hallazgoCambioGiro: number = 0;
  hallazgoFaltaDocumentacion: number = 0;
  hallazgoNegaronAcceso: number = 0;


  observacion: string = '';
  lectura_medidor: string = '';
  imgs: any;
  nombreInspectores = []; // donde se guardaran todos los inspectores de la plaza
  nombreInspectorLogueado: string = '';
  inspector2: string = '';
  inspector3: string = '';
  inspector4: string = '';
  tipoServicioPadron: string = '';

  latitud: number;
  longitud: number;
  fechaCaptura: string = "";
  idAspuser: string = "";

  fechaActual: string;
  g: any;
  t: any;
  infoAccount: any[];
  image: string = "";
  isPhoto: boolean = false;
  isMotive: boolean = false;
  tareaAsignada: string;
  nombreTareaAsignada: string = '';
  idAccountSqlite: number;
  loading: any;
  userInfo: any;
  indicadorImagen: number = 0;
  infoImage: any[];
  takePhoto: boolean = false;
  activaOtroMotivo: boolean = false;

  nombrePlaza: any;
  id_plaza: any;
  idServicioPlaza: number = 0;


  // validaciones de campos
  activaOtrosHallazgos: boolean = false;
  mostrarInspectores: boolean = false;
  inspectores: boolean = false; // para mostrar la lista de inspectores
  detectedChanges: boolean = false;
  mostrarOtroPuesto: boolean = false;
  mostrarIrregularidades: boolean = true;

  giro: string = '';
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
    private navCtrl: NavController,
    private router: Router,
    private callNumber: CallNumber,
    private alertCtrl: AlertController
  ) {
    this.imgs = [{ imagen: "assets/img/imgs.png" }];
  }

  @ViewChild('segmentPrincipal', { static: true }) segmentPrincipal;

  async ngOnInit() {
    await this.platform.ready();
    await this.getInfoAccount();
    //this.getTotals();
    this.getFechaActual();
    this.getPlaza();
    this.idServicioPlaza = await this.storage.get('IdServicioActivo');
    this.estatusLecturaMedidor();
  }

  async estatusLecturaMedidor() {
    if(this.idServicioPlaza === 1) {
      this.plazaAgua = true;
    } else {
      this.plazaAgua = false;
    }
  }

  // results

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
    if(tipo !== '8'){
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

  resultNinguna(event) {
    if (event.detail.value == 'ningunaSi') {
      this.hallazgoNinguna = 1
      // deshabilitar todos los demas segment
      this.mostrarIrregularidades = false;
    } else {
      this.hallazgoNinguna = 0
      this.mostrarIrregularidades = true;
    }
  }

  resultNegaronAcceso(event) {
    if (event.detail.value == 'negaronAccesoSi') {
      this.hallazgoNegaronAcceso = 1
    } else {
      this.hallazgoNegaronAcceso = 0
    }
  }

  resultMedidorDescompuesto(event) {
    if (event.detail.value == 'medidorDescompuestoSi') {
      this.hallazgoMedidorDescompuesto = 1
    } else {
      this.hallazgoMedidorDescompuesto = 0
    }
  }

  resultDiferenciaDiametro(event) {
    if (event.detail.value == 'diferenciaDiametroSi') {
      this.hallazgoDiferenciaDiametro = 1
    } else {
      this.hallazgoDiferenciaDiametro = 0
    }
  }

  resultTomaClandestina(event) {
    if (event.detail.value == 'tomaClandestinaSi') {
      this.hallazgoTomaClandestina = 1
    } else {
      this.hallazgoTomaClandestina = 0
    }
  }

  resultDerivacionClandestina(event) {
    if (event.detail.value == 'derivacionClandestinaSi') {
      this.hallazgoDerivacionClandestina = 1
    } else {
      this.hallazgoDerivacionClandestina = 0
    }
  }

  resultDrenajeClandestino(event) {
    if (event.detail.value == 'DrenajeClandestinoSi') {
      this.hallazgoDrenajeClandestino = 1
    } else {
      this.hallazgoDrenajeClandestino = 0
    }
  }

  resultCambioGiro(event) {
    if (event.detail.value == 'cambioGiroSi') {
      this.hallazgoCambioGiro = 1
    } else {
      this.hallazgoCambioGiro = 0
    }
  }

  resultFaltaDocumentacion(event) {
    if (event.detail.value == 'faltaDocumentacionSi') {
      this.hallazgoFaltaDocumentacion = 1
    } else {
      this.hallazgoFaltaDocumentacion = 0
    }
  }


  ///////////////////////



  async getPlaza() {
    this.nombrePlaza = await this.storage.get('NombrePlazaActiva');
    this.id_plaza = await this.storage.get('IdPlazaActiva');
  }

  ionViewWillLeave() {
    if (this.detectedChanges) {
      this.mensaje.showAlert(
        "La gestión no se guardará, tendras que capturar de nuevo"
      );
    }
  }

  exit() {
    //this.modalController.dismiss();
    this.navCtrl.navigateRoot(['/home/tab2']);
  }


  async muestraInspectores() {
    this.mostrarInspectores = true;
    this.inspectores = true;
    this.nombreInspectorLogueado = await this.storage.get('Nombre');
    try {
      this.nombreInspectores = await this.rest.mostrarEmpleadosPlaza(this.id_plaza);
      console.log(this.nombreInspectores);
    } catch (error) {
      console.log("Error al traer los datos de los inspectores")
    }
  }


  ocultaInspectores() {
    this.mostrarInspectores = false;
    this.inspectores = false;
  }

  async getInfoAccount() {
    this.account = await this.storage.get("account");
    //console.log("Cuenta guardada en el storage: " , this.account);
    this.idAspuser = await this.storage.get("IdAspUser");
    //console.log("Idaspuser guardado en el storage: ", this.idAspuser);
    this.infoAccount = await this.rest.getInfoAccount(this.account);
    //console.log("InfoAccount: " , this.infoAccount);
    this.propietario = this.infoAccount[0].propietario;
    console.log("Propietario ", this.propietario);
    this.idAccountSqlite = this.infoAccount[0].id;
    this.tareaAsignada = this.infoAccount[0].tarea_asignada;
    this.nombreTareaAsignada = this.infoAccount[0].nombre_tarea_asignada;
    this.tipoServicioPadron = this.infoAccount[0].tipo_servicio;
    let gestionada = this.infoAccount[0].gestionada;
    if (gestionada == 1) {
      this.mensaje.showAlert("Esta cuenta ya ha sido gestionada");
      this.router.navigateByUrl("home/tab2");
    }
  }

  // async getTotals() {
  //   this.usersFirebase.getTotals().subscribe(async user => {
  //     this.userInfo = user;
  //     this.g = this.userInfo.managedAccounts;
  //     this.t = this.userInfo.totalAccounts;
  //   });
  // }


  getFechaActual() {
    var dateDay = new Date().toISOString();
    let date: Date = new Date(dateDay);
    let ionicDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );

    this.fechaActual = ionicDate.toISOString();
    let fecha = this.fechaActual.split("T");
    this.fechaActual = fecha[0];
    //console.log("Esta es la fecha Actual :::::::::::" + this.fechaActual);
  }

  async deletePhoto(img) {
    // console.log(img);
    // console.log(this.imgs);

    for (let i = 0; i < this.imgs.length; i++) {
      //console.log(this.imgs[i].imagen);
      if (this.imgs[i].imagen == img) {
        this.imgs.splice(i, 1);
      } else {
        // console.log("No hay coincidencias");
      }
    }
    //borrara la foto trayendo la imagen de la tabla y mandando a llamar al metodo delete del restservice
    this.infoImage = await this.rest.getImageLocal(img);
    //console.log(this.infoImage[0]);
  }

  async confirmaFoto(tipo) {
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

  async takePicGallery(type) {
    let tipo;
    if (type == 1) {
      tipo = "Inspección recorrido";
    } else if (type == 2) {
      tipo = "Inspección evidencia";
    } else if (type == 3) {
      tipo = 'Inspección toma'
    } else if (type == 4) {
      tipo = 'Inspección observación contribuyente'
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
        //console.log(rutaBase64, this.image);
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
          this.idAspuser,
          this.tareaAsignada,
          tipo,
          this.idServicioPlaza
        );
      })
      .catch(error => {
        console.error(error);
      });
  }


  async takePic(type) {
    let tipo;
    if (type == 1) {
      tipo = "Inspección recorrido";
    } else if (type == 2) {
      tipo = "Inspección evidencia";
    } else if (type == 3) {
      tipo = 'Inspección toma'
    } else if (type == 4) {
      tipo = 'Inspección observación contribuyente'
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
        //console.log(rutaBase64, this.image);
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
          this.idAspuser,
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
        //console.log(res);
        this.mensaje.showToast("Se almacenó la imagen correctamente");
      });
  }


  async verify() {
    let account = this.account;
    this.loading = await this.loadingController.create({
      message: "Obteniendo la ubicación de esta gestión y guardando...."
    });

    await this.loading.present();


    this.geolocation.getCurrentPosition().then(async (resp) => {

      if (resp) {
        this.latitud = resp.coords.latitude;
        this.longitud = resp.coords.longitude
        //console.log("La latitud es", this.latitud);
        //console.log("La longitud es ", this.longitud);
        this.loading.dismiss();


        this.loading = await (this.loadingController.create({
          message: 'Guardando la gestión...'
        }));

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
          //numeroContacto: this.numeroContacto, se quito
          idPuesto: this.idPuesto,
          otroPuesto: this.otroPuesto,
          // idMotivoNoPago: this.idMotivoNoPago, se quito por que estara en la app de encuesta
          // otroMotivo: this.otroMotivo, se quito por que estara en la app de encuesta
          idTipoServicio: this.idTipoServicio,
          numeroNiveles: this.numeroNiveles,
          colorFachada: this.colorFachada,
          colorPuerta: this.colorPuerta,
          referencia: this.referencia,
          idTipoPredio: this.idTipoPredio,
          entreCalle1: this.entreCalle1,
          entrecalle2: this.entreCalle2,
          hallazgoNinguna: this.hallazgoNinguna,
          hallazgoNegaronAcceso: this.hallazgoNegaronAcceso,
          hallazgoMedidorDescompuesto: this.hallazgoMedidorDescompuesto,
          hallazgoDiferenciaDiametro: this.hallazgoDiferenciaDiametro,
          hallazgoTomaClandestina: this.hallazgoTomaClandestina,
          hallazgoDerivacionClandestina: this.hallazgoDerivacionClandestina,
          hallazgoDrenajeClandestino: this.hallazgoDrenajeClandestino,
          hallazgoCambioGiro: this.hallazgoCambioGiro,
          hallazgoFaltaDocumentacion: this.hallazgoFaltaDocumentacion,
          idAspUser: this.idAspuser,
          inspector2: this.inspector2,
          inspector3: this.inspector3,
          inspector4: this.inspector4,
          observacion: this.observacion,
          lectura_medidor: this.lectura_medidor,
          giro: this.giro,
          idTarea: this.tareaAsignada,
          fechaCaptura: this.fechaCaptura,
          latitud: this.latitud,
          longitud: this.longitud,
          idServicioPlaza: this.idServicioPlaza,
          id: this.idAccountSqlite
        };
        await this.gestionInspeccion(data);
        this.loading.dismiss();
        this.exit();

      } // if
    }).catch(async (error) => {
      //console.log("No se pudo obtener la geolocalizacion " + error);
      this.latitud = this.infoAccount[0].latitud;
      this.longitud = this.infoAccount[0].longitud;
      //console.log(`La latitud de implementta es ${this.latitud} y la longitud de implementta es ${this.longitud}`);
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
        //numeroContacto: this.numeroContacto,
        idPuesto: this.idPuesto,
        otroPuesto: this.otroPuesto,
        // idMotivoNoPago: this.idMotivoNoPago, se quito por que estara en la app de encuesta
        // otroMotivo: this.otroMotivo, se quito por que estara en la app de encuesta
        idTipoServicio: this.idTipoServicio,
        numeroNiveles: this.numeroNiveles,
        colorFachada: this.colorFachada,
        colorPuerta: this.colorPuerta,
        referencia: this.referencia,
        idTipoPredio: this.idTipoPredio,
        entreCalle1: this.entreCalle1,
        entrecalle2: this.entreCalle2,
        hallazgoNinguna: this.hallazgoNinguna,
        hallazgoNegaronAcceso: this.hallazgoNegaronAcceso,
        hallazgoMedidorDescompuesto: this.hallazgoMedidorDescompuesto,
        hallazgoDiferenciaDiametro: this.hallazgoDiferenciaDiametro,
        hallazgoTomaClandestina: this.hallazgoTomaClandestina,
        hallazgoDerivacionClandestina: this.hallazgoDerivacionClandestina,
        hallazgoDrenajeClandestino: this.hallazgoDrenajeClandestino,
        hallazgoCambioGiro: this.hallazgoCambioGiro,
        hallazgoFaltaDocumentacion: this.hallazgoFaltaDocumentacion,
        idAspUser: this.idAspuser,
        inspector2: this.inspector2,
        inspector3: this.inspector3,
        inspector4: this.inspector4,
        observacion: this.observacion,
        lectura_medidor: this.lectura_medidor,
        giro: this.giro,
        idTarea: this.tareaAsignada,
        fechaCaptura: this.fechaCaptura,
        latitud: this.latitud,
        longitud: this.longitud,
        idServicioPlaza: this.idServicioPlaza,
        id: this.idAccountSqlite
      };
      await this.gestionInspeccion(data);
      this.loading.dismiss();
      this.exit();

    }); // catch

  }

  async gestionInspeccion(data) {
    this.detectedChanges = false;
    //console.log(data);
    await this.rest.gestionInspeccion(data);
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
          handler: blah => {
            //console.log("Confirm Cancel: blah");
          }
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

    console.log(this.id_plaza);
    console.log(this.account);

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

      this.callNumber.callNumber('911', true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));

    }
  }


}
