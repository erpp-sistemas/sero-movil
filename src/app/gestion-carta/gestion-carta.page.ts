import { Component, OnInit } from '@angular/core';
import { Storage } from "@ionic/storage";
import { MessagesService } from '../services/messages.service';
import { ModalController, Platform, LoadingController, AlertController } from '@ionic/angular';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { RestService } from '../services/rest.service';
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Router } from '@angular/router';
import { PhotosHistoryPage } from '../photos-history/photos-history.page';
import { EncuestaPage } from '../encuesta/encuesta.page';
import { ActionsHistoryPage } from '../actions-history/actions-history.page';
import { LecturaMedidorPage } from '../lectura-medidor/lectura-medidor.page';
import { DblocalService } from '../services/dblocal.service';
import { PhotoService } from '../services/photo.service';
import { RegisterService } from '../services/register.service';
import { UpdateAddressPage } from '../update-address/update-address.page';
import { Address } from '../interfaces/Address';
import { DataInfoAccount } from '../interfaces';


@Component({
  selector: 'app-gestion-carta',
  templateUrl: './gestion-carta.page.html',
  styleUrls: ['./gestion-carta.page.scss'],
})
export class GestionCartaPage implements OnInit {

  data_info_account: DataInfoAccount;
  show_info_data_account: boolean = false;

  imgs: any;
  account: string;
  infoAccount: any = [];
  idEstatusPredio: string = '';
  personaAtiende: string = '';
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
  idAccountSqlite: any;
  idTareaGestor: any;
  gestionada: number;
  tareaAsignada: number = 0;
  fechaActual: any;
  infoImage: any = [];
  takePhoto: boolean = false;
  takePhotoFachada: boolean = false;
  takePhotoEvidencia: boolean = false;
  indicadorImagen: number = 0;
  isPhoto: boolean = false;
  image: string = '';
  loading: any;
  fechaCaptura: any;
  fechaCapturaFoto: any;
  tipoServicio: number = 0;
  idServicioPlaza: number = 0;
  giro: string = '';

  activaFormulario: boolean = false;
  desactivaBotonesCamara: boolean = true;
  activaOtroMotivo: boolean = false;
  otroMotivo: string = '';

  encuestaRealizada: boolean = false;
  tomaLecturaRealizada: boolean = false;
  plazaAgua: boolean;
  mostrarGiro: boolean = false;


  idTipoGestion: string = '1';
  activaPostpago: boolean = false;
  fechaCapturaPostpago: string = '1989-04-26';
  listadoGestores: any = [];
  listadoPagos: any = [];

  idTiempoSuministroAgua: string = '';
  activaOtroSuministroAgua: boolean = false;

  lunes: string = '';
  martes: string = '';
  miercoles: string = '';
  jueves: string = '';
  viernes: string = '';
  sabado: string = '';
  domingo: string = '';

  geoPosicion: any = {};

  id_proceso: any;

  sello: number = 0;
  domicilio_actualizado: boolean = false;
  verificacionDomicilio: boolean = false;
  idMotivoNoPago: number = 0;

  // campos obligatorios
  leyendaEstatusPredio: boolean = false;
  leyendaTipoServicioObligatorio: boolean = false;
  leyendaMotivoNoPago: boolean = false;
  leyendaOtroMotivo: boolean = false;
  leyendaPersonaAtiende: boolean = false;
  leyendaGiro: boolean = false;
  leyendaNumeroNiveles: boolean = false;
  leyendaFachada: boolean = false;
  leyendaColorPuerta: boolean = false;
  leyendaReferencia: boolean = false;
  leyendaTipoPredio: boolean = false;
  leyendaEntreCalle1: boolean = false;
  leyendaEntreCalle2: boolean = false;
  leyendaObservaciones: boolean = false;

  data_domicilio_actualizado: Address;

  backButtonSubscription: any



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
    private router: Router,
    private alertCtrl: AlertController,
    private dbLocalService: DblocalService,
    private photoService: PhotoService,
    private registerService: RegisterService
  ) {
    this.imgs = [{ imagen: "assets/img/imgs.png" }];
  }

  async ngOnInit() {
    await this.platform.ready();
    this.getInfoData();
    this.getFechaActual();
    this.idServicioPlaza = await this.storage.get('IdServicioActivo');
    this.estatusLecturaMedidor();
  }

  ionViewDidEnter() {
    this.subscribeToBackButton();
  }

  ionViewWillLeave() {
    this.unsubscribeFromBackButton();
  }

  private async subscribeToBackButton() {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(0, async () => {
      const mensaje = await this.alertCtrl.create({
        header: "Mensaje",
        subHeader: "Si sales perderas los cambios de la gestión",
        buttons: [
          {
            text: "Cancelar",
            cssClass: "secondary",
            handler: () => {
              console.log("Regresar")
            }
          },
          {
            text: "Aceptar",
            cssClass: "secondary",
            handler: () => {
              this.router.navigateByUrl('home/tab1')
            }
          }
        ]
      });
      await mensaje.present();
    });
  }

  private unsubscribeFromBackButton() {
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }


  async estatusLecturaMedidor() {
    if (this.idServicioPlaza === 1) {
      this.plazaAgua = true;
    } else {
      this.plazaAgua = false;
    }
  }


  async getInfoData() {
    this.account = await this.storage.get("account");
    this.infoAccount = await this.dbLocalService.getInfoAccount(this.account);
    let gestionada = this.infoAccount[0].gestionada;
    if (gestionada == 1) {
      this.mensaje.showAlert("Esta cuenta ya ha sido gestionada");
      this.router.navigateByUrl('home/tab2');
    }
    this.id_plaza = await this.storage.get('IdPlazaActiva');
    this.nombrePlaza = await this.storage.get('NombrePlazaActiva');
    this.id_proceso = await this.storage.get('id_proceso');
    this.idAspUser = await this.storage.get('IdAspUser');
    this.idAccountSqlite = this.infoAccount[0].id;
    this.tipoServicioPadron = this.infoAccount[0].tipo_servicio;
    this.tareaAsignada = this.infoAccount[0].tarea_asignada;

    this.data_info_account = {
      account: this.account,
      id_plaza: this.id_plaza,
      nombrePlaza: this.nombrePlaza,
      iconoProceso: await this.storage.get('icono_proceso'),
      nombreProceso: await this.storage.get('proceso_gestion'),
      nombreTareaAsignada: this.infoAccount[0].nombre_tarea_asignada,
      propietario: this.infoAccount[0].propietario
    }
    this.show_info_data_account = true;
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

  async deletePhoto(img: any) {
    for (let i = 0; i < this.imgs.length; i++) {
      if (this.imgs[i].imagen == img) {
        this.imgs.splice(i, 1);
      }
    }
    this.infoImage = await this.photoService.getImageLocal(img);
  }

  takePic(type: any) {
    let tipo: any;
    if (type == 1) {
      if (this.id_proceso === 7) {
        tipo = 'Cortes fachada predio'
      } else {
        tipo = 'Carta invitación fachada predio'
      }
      this.takePhotoFachada = true;
    } else if (type == 2) {
      if (this.id_proceso === 7) {
        tipo = 'Cortes evidencia'
      } else {
        tipo = 'Carta invitación evidencia'
      }
      this.takePhotoEvidencia = true;
    } else if (type == 3) {
      if (this.id_proceso === 7) {
        tipo = 'Cortes toma'
      } else {
        tipo = 'Carta invitación toma'
      }
    }


    if (this.idTipoGestion === '1') {

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

      this.fechaCapturaFoto = ionicDate.toISOString();

    } else if (this.idTipoGestion === '2') {

      let fecha = new Date(this.fechaCapturaPostpago).toISOString();
      let fechaDate = new Date(fecha);

      let fechaHoy = new Date().toISOString();
      let dateHoy = new Date(fechaHoy);

      let ionicDate = new Date(
        Date.UTC(
          fechaDate.getFullYear(),
          fechaDate.getMonth(),
          fechaDate.getDate(),
          dateHoy.getHours(),
          dateHoy.getMinutes(),
          dateHoy.getSeconds()
        )
      );
      this.fechaCapturaFoto = ionicDate.toISOString();
    }

    this.fechaCapturaFoto

    let options: CameraOptions = {
      quality: 40,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true
    };
    this.camera
      .getPicture(options)
      .then(imageData => {
        this.indicadorImagen = this.indicadorImagen + 1;
        let rutaBase64 = imageData;
        this.image = this.webview.convertFileSrc(imageData);
        this.isPhoto = false;
        this.imgs.push({ imagen: this.image });
        if (this.indicadorImagen == 1) {
          this.imgs.splice(0, 1);
        }
        this.saveImage(this.id_plaza, this.nombrePlaza, this.image, this.account, this.fechaCapturaFoto, rutaBase64, this.idAspUser, this.tareaAsignada, tipo, this.idServicioPlaza);
      })
      .catch(error => {
        console.error(error);
      });

  }

  takePicGallery(type: any) {
    let tipo: any;
    if (type == 1) {
      if (this.id_proceso === 7) {
        tipo = 'Cortes fachada predio'
      } else {
        tipo = 'Carta invitación fachada predio'
      }
      this.takePhotoFachada = true;
    } else if (type == 2) {
      if (this.id_proceso === 7) {
        tipo = 'Cortes evidencia'
      } else {
        tipo = 'Carta invitación evidencia'
      }
      this.takePhotoEvidencia = true;
    } else if (type == 3) {
      if (this.id_proceso === 7) {
        tipo = 'Cortes toma'
      } else {
        tipo = 'Carta invitación toma'
      }
    }


    if (this.idTipoGestion === '1') {

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

      this.fechaCapturaFoto = ionicDate.toISOString();

    } else if (this.idTipoGestion === '2') {

      let fecha = new Date(this.fechaCapturaPostpago).toISOString();
      let fechaDate = new Date(fecha);

      let fechaHoy = new Date().toISOString();
      let dateHoy = new Date(fechaHoy);

      let ionicDate = new Date(
        Date.UTC(
          fechaDate.getFullYear(),
          fechaDate.getMonth(),
          fechaDate.getDate(),
          dateHoy.getHours(),
          dateHoy.getMinutes(),
          dateHoy.getSeconds()
        )
      );
      this.fechaCapturaFoto = ionicDate.toISOString();
    }

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
        this.isPhoto = false;
        this.imgs.push({ imagen: this.image });
        if (this.indicadorImagen == 1) this.imgs.splice(0, 1);
        this.saveImage(this.id_plaza, this.nombrePlaza, this.image, this.account, this.fechaCapturaFoto, rutaBase64, this.idAspUser, this.tareaAsignada, tipo, this.idServicioPlaza);
      })
      .catch(error => {
        console.error(error);
      });

  }

  saveImage(id_plaza, nombrePlaza, image, accountNumber, fecha, rutaBase64, idAspuser, idTarea, tipo, idServicioPlaza) {
    this.photoService
      .saveImage(id_plaza, nombrePlaza, image, accountNumber, fecha, rutaBase64, idAspuser, idTarea, tipo, idServicioPlaza)
      .then(res => this.mensaje.showToast("Se almacenó la imagen correctamente"));
  }

  async messageTerminarGestion() {
    const mensaje = await this.alertCtrl.create({
      header: "Mensaje",
      subHeader: "Recuerda que las fotos deben de estar correctas, de lo contrario es posible que la gestión no sea válida",
      buttons: [
        {
          text: "Regresar",
          cssClass: "secondary",
          handler: () => {
            console.log("Regresar")
          }
        },
        {
          text: "Aceptar",
          cssClass: "secondary",
          handler: () => {
            this.terminar()
          }
        }
      ]
    });
    await mensaje.present();
  }


  async terminar() {

    await this.validarCamposObligatorios();

    if (this.leyendaEstatusPredio || this.leyendaTipoServicioObligatorio || this.leyendaOtroMotivo || this.leyendaPersonaAtiende || this.leyendaGiro || this.leyendaNumeroNiveles || this.leyendaFachada || this.leyendaFachada || this.leyendaReferencia || this.leyendaTipoPredio || this.leyendaEntreCalle1 || this.leyendaEntreCalle2 || this.leyendaObservaciones || this.takePhotoFachada === false || this.takePhotoEvidencia === false) {
      this.mensaje.showAlert("Ingresa los campos obligatorios * y toma mínimo una foto de fachada y una foto de evidencia");
      return;
    }
    this.eliminarCaracteres();
    this.obetenerFechaGestion();
    await this.obtenerUbicacion();

    this.loading = await this.loadingController.create({
      message: 'Guardando la gestión...',
      spinner: 'dots'
    })

    await this.loading.present();

    console.log(this.data_domicilio_actualizado);

    let data = {
      id_plaza: this.id_plaza,
      nombrePlaza: this.nombrePlaza,
      account: this.account,
      persona_atiende: this.personaAtiende,
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
      idEstatusPredio: this.idEstatusPredio,
      idTipoGestion: this.idTipoGestion,
      idTiempoSuministroAgua: this.idTiempoSuministroAgua,
      lunes: this.lunes,
      martes: this.martes,
      miercoles: this.miercoles,
      jueves: this.jueves,
      viernes: this.viernes,
      sabado: this.sabado,
      domingo: this.domingo,
      colocoSello: this.sello,
      idMotivoNoPago: this.idMotivoNoPago,
      otroMotivoNoPago: this.otroMotivo,
      domicilio_verificado: this.verificacionDomicilio ? 1 : 0,
      id: this.idAccountSqlite
    }

    // guarda local
    await this.gestionCarta(data);
    // envia al servidor
    await this.sendGestionServer();
    // envia la encuesta si se realizao
    if (this.encuestaRealizada) {
      await this.sendEncuestaServer();
    }

    this.loading.dismiss();
    this.exit();

  }

  async obtenerUbicacion() {
    let loadingGeolocation = await this.loadingController.create({
      message: 'Obteniendo ubicación...',
      spinner: 'dots'
    });

    await loadingGeolocation.present();

    await this.getGeolocation();

    if (this.geoPosicion.coords) {
      this.latitud = this.geoPosicion.coords.latitude;
      this.longitud = this.geoPosicion.coords.longitude;
    } else {
      this.latitud = 0;
      this.longitud = 0;
    }

    loadingGeolocation.dismiss();
  }

  obetenerFechaGestion() {
    if (this.idTipoGestion === '1') {
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
    } else if (this.idTipoGestion === '2') {

      let fecha = new Date(this.fechaCapturaPostpago).toISOString();
      let fechaDate = new Date(fecha);

      let fechaHoy = new Date().toISOString();
      let dateHoy = new Date(fechaHoy);

      let ionicDate = new Date(
        Date.UTC(
          fechaDate.getFullYear(),
          fechaDate.getMonth(),
          fechaDate.getDate(),
          dateHoy.getHours(),
          dateHoy.getMinutes(),
          dateHoy.getSeconds()
        )
      );
      this.fechaCaptura = ionicDate.toISOString();
    }
  }

  async validarCamposObligatorios() {
    //* cuando el id_estatus_predio no se captura
    if (this.idEstatusPredio === '') {
      this.leyendaEstatusPredio = true;
      return;
    }

    //* cuando es predio no localizado lo deja pasar solo pidiendole las observaciones
    if (this.idEstatusPredio === '4' && this.observaciones !== '') {
      this.takePhotoFachada = true;
      this.takePhotoEvidencia = true;
      this.clearFields();
      this.hideLeyendas();
    }

    //* cuando es predio no lozalizado pero no puso las observaciones no lo deja pasar
    if (this.idEstatusPredio === '4' && this.observaciones === '') return this.leyendaObservaciones = true;


    //* cuando es predio abandonado o predio baldio le pedira el tipo de predio, las referencias y las entre calles, si los mete lo deja pasar
    if (
      (this.idEstatusPredio === '2' || this.idEstatusPredio === '3') &&
      (this.referencia !== '' || this.entreCalle1 !== '' || this.entreCalle2 !== '' || this.idTipoPredio !== 0 || this.observaciones !== '')
    ) {
      this.takePhotoFachada = true;
      this.takePhotoEvidencia = true;
      return;
    }

    //* cuando es predio abandonado o predio baldio le pedira el tipo de predio y las referencia y las entre calles, si no los mete le muestra los mensajes de error
    if (
      (this.idEstatusPredio === '2' || this.idEstatusPredio === '3') &&
      (this.referencia === '' || this.entreCalle1 === '' || this.entreCalle2 === '' || this.idTipoPredio === 0 || this.observaciones === '')
    ) {
      this.leyendaEntreCalle1 = true;
      this.leyendaEntreCalle2 = true;
      this.leyendaTipoPredio = true;
      this.leyendaReferencia = true;
      this.leyendaObservaciones = true;
      return;
    }

    if (this.idEstatusPredio === '1') {
      if (this.observaciones === '') this.leyendaObservaciones = true;
      if (this.idMotivoNoPago === 0) this.leyendaMotivoNoPago = true
      if (this.idMotivoNoPago == 5 && this.otroMotivo === '') this.leyendaOtroMotivo = true;
      if (this.idTipoServicio === 0) this.leyendaTipoServicioObligatorio = true;
      if (this.idEstatusPredio !== '1') this.numeroNiveles = 0;
      if (this.personaAtiende === '') this.leyendaPersonaAtiende = true;
      if (this.giro === '') this.leyendaGiro = true;
      if (this.numeroNiveles === 0) this.leyendaNumeroNiveles = true;
      if (this.colorFachada === '') this.leyendaFachada = true;
      if (this.colorFachada === '') this.leyendaColorPuerta = true;
      if (this.referencia === '') this.leyendaReferencia = true;
      if (this.idTipoPredio === 0) this.leyendaTipoPredio = true;
      if (this.entreCalle1 === '') this.leyendaEntreCalle1 = true;
      if (this.entreCalle2 === '') this.leyendaEntreCalle2 = true;
    }

  }

  validateField(event: any, variable_name: string) {
    const valor = event.detail.value;
    if (valor.length >= 4) {
      (this as any)[variable_name] = false;
    }
  }

  hideLeyendas() {
    this.leyendaTipoServicioObligatorio = false;
    this.leyendaEstatusPredio = false;
    this.leyendaOtroMotivo = false;
    this.leyendaMotivoNoPago = false;
    this.leyendaPersonaAtiende = false;
    this.leyendaGiro = false;
    this.leyendaNumeroNiveles = false;
    this.leyendaFachada = false;
    this.leyendaFachada = false;
    this.leyendaReferencia = false;
    this.leyendaTipoPredio = false;
    this.leyendaEntreCalle1 = false;
    this.leyendaEntreCalle2 = false;
    //this.leyendaObservaciones = false;
  }

  clearFields() {
    this.idMotivoNoPago = 0;
    this.otroMotivo = '';
    this.personaAtiende = '';
    this.tipoServicio = 0;
    this.giro = '';
    this.lectura_medidor = '';
    this.idTiempoSuministroAgua = '';
    this.lunes = '';
    this.martes = '';
    this.miercoles = '';
    this.jueves = '';
    this.viernes = '';
    this.sabado = '';
    this.domingo = '';
    this.numeroNiveles = 0;
    this.colorFachada = '';
    this.colorPuerta = '';
    this.referencia = '';
    this.idTipoPredio = 0;
    this.entreCalle1 = '';
    this.entreCalle2 = '';
    this.sello = 0;
  }


  async gestionCarta(data: any) {
    if (this.id_proceso === 7) {
      await this.registerService.gestionCortes(data)
    } else {
      this.registerService.gestionCartaInvitacion(data)
        .then((respuesta: string) => this.mensaje.showToast(respuesta))
        .catch((error: string) => this.mensaje.showToast(error));
    }
  }

  async sendGestionServer() {
    try {
      await this.registerService.sendCartaByIdServicioAccount(this.idServicioPlaza, this.account);
      if (Object.keys(this.data_domicilio_actualizado).length > 0) await this.registerService.sendAddressUptade(this.data_domicilio_actualizado);
    } catch (error) {
      console.error(error);
    }
  }

  async sendEncuestaServer() {
    try {
      //await this.rest.sendEncuestaByCuenta(this.idServicioPlaza, this.account);
    } catch (error) {
      console.error(error);
    }
  }

  exit() {
    this.router.navigateByUrl('home/tab2');
  }

  async getGeolocation() {
    return new Promise(async (resolve, reject) => {
      try {
        setTimeout(() => {
          resolve(this.geoPosicion);
        }, 8000);
        this.geoPosicion = await this.geolocation.getCurrentPosition();
      } catch (error) {
        console.log(error);
        reject(error)
      }
    })
  }

  resultEstatusPredio(event: any) {
    let estatus = event.detail.value;
    this.leyendaEstatusPredio = false
    if (estatus === '1') {
      this.activaFormulario = true;
      this.desactivaBotonesCamara = false; // ? ahorita esto funciona para activar o desactivar el boton para abrir la encuesta
    } else {
      this.activaFormulario = false;
      this.desactivaBotonesCamara = true; // ? ahorita esto funciona para activar o desactivar el boton para abrir la encuesta
    }
  }


  resultTipoServicio(event) {
    let tipo = event.detail.value;
    this.leyendaTipoServicioObligatorio = false;
    if (tipo !== "8") {
      this.mostrarGiro = true;
    } else {
      this.mostrarGiro = false;
    }
  }

  resultMotivoNoPago(event) {
    let motivo = event.detail.value;
    this.leyendaMotivoNoPago = false
    if (motivo === '5') {
      this.activaOtroMotivo = true;
    } else {
      this.activaOtroMotivo = false;
      this.leyendaOtroMotivo = false;
    }
  }

  resultOtroMotivoNoPago(event) {
    let otroMotivo = event.detail.value;
    if (otroMotivo !== '') this.leyendaOtroMotivo = false
  }

  async resultPostpago(event) {
    let tipo = event.detail.value;
    if (tipo === '1') {
      this.activaPostpago = false;
      this.idAspUser = await this.storage.get('IdAspUser');
    } else if (tipo === '2') {
      this.activaPostpago = true;
      await this.llenarListadoGestores();
      await this.llenarListadoPagos();
    }
  }

  async resultTiempoSuministroAgua(event) {
    let tipo = event.detail.value;
    if (tipo === '4') {
      this.activaOtroSuministroAgua = true
    } else {
      this.activaOtroSuministroAgua = false;
    }
  }

  resultLunes(event) {
    let seleccion = event.target.value;
    console.log(seleccion);
    if (seleccion == 'lunesSi') {
      this.lunes = 'si'
    } else {
      this.lunes = 'no'
    }
  }

  resultMartes(event) {
    let seleccion = event.target.value;
    if (seleccion == 'martesSi') {
      this.martes = 'si'
    } else {
      this.martes = 'no'
    }
  }

  resultMiercoles(event) {
    let seleccion = event.target.value;
    if (seleccion == 'miercolesSi') {
      this.miercoles = 'si'
    } else {
      this.miercoles = 'no'
    }
  }

  resultJueves(event) {
    let seleccion = event.target.value;
    if (seleccion == 'juevesSi') {
      this.jueves = 'si'
    } else {
      this.jueves = 'no'
    }
  }

  resultViernes(event) {
    let seleccion = event.target.value;
    if (seleccion == 'viernesSi') {
      this.viernes = 'si'
    } else {
      this.viernes = 'no'
    }
  }

  resultSabado(event) {
    let seleccion = event.target.value;
    if (seleccion == 'sabadoSi') {
      this.sabado = 'si'
    } else {
      this.sabado = 'no'
    }
  }

  resultDomingo(event) {
    let seleccion = event.target.value;
    if (seleccion == 'domingoSi') {
      this.domingo = 'si'
    } else {
      this.domingo = 'no'
    }
  }


  async llenarListadoGestores() {
    this.listadoGestores = await this.rest.obtenerGestoresPlaza(this.id_plaza);
  }

  async llenarListadoPagos() {
    this.listadoPagos = await this.rest.getPagosHistoryByCuenta(this.id_plaza, this.account);
    console.log(this.listadoPagos);
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
    if (resultadoEncuesta === 'Realizado') this.encuestaRealizada = true;
  }

  async openLecturaMedidor() {
    let idPlaza = this.id_plaza;
    const modal = await this.modalController.create({
      component: LecturaMedidorPage,
      componentProps: {
        "account": this.account,
        "idPlaza": idPlaza,
        "idServicioPlaza": this.idServicioPlaza
      }
    })
    await modal.present()
    const data = await modal.onDidDismiss();
  }

  eliminarCaracteres() {
    this.observaciones = this.observaciones.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
    this.entreCalle1 = this.entreCalle1.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
    this.entreCalle2 = this.entreCalle2.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
    this.referencia = this.referencia.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
    this.colorFachada = this.colorFachada.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
    this.colorPuerta = this.colorPuerta.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
    this.giro = this.giro.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
    this.otroMotivo = this.otroMotivo.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
  }

  async colocacionSello() {
    const alert = await this.alertCtrl.create({
      header: "Colocación de sello",
      subHeader: "Aceptar para confirmar la colocación del sello",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary",
          handler: blah => console.log("Confirm Cancel: blah")
        },
        {
          text: "Confirmar",
          cssClass: "secondary",
          handler: () => {
            this.sello = 1;
          }
        }
      ]
    });
    await alert.present();
  }

  async goUpdateAddress() {
    const alert = await this.alertCtrl.create({
      header: 'Actualizar domicilio',
      subHeader: '¿Desea actualizar los datos del domicilio?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: "secondary",
          handler: blah => console.log("Cancel !!!!")
        },
        {
          text: 'Confirmar',
          cssClass: 'secondary',
          handler: () => this.showModalUpdateAddress()
        }
      ]
    });
    await alert.present();
  }

  async showModalUpdateAddress() {
    const modal = await this.modalController.create({
      component: UpdateAddressPage,
      componentProps: {
        "account": this.account,
        "idPlaza": this.id_plaza,
        "idUsuario": this.idAspUser,
        "data": this.infoAccount
      }
    });
    await modal.present();
    const res = await modal.onDidDismiss();
    if (res.data) {
      let { data } = res;
      this.data_domicilio_actualizado = data.data;
      this.domicilio_actualizado = true;
    }
  }

  async verificarDomicilio() {
    const alert = await this.alertCtrl.create({
      header: 'Verificación de domicilio',
      subHeader: '¿Deseas verificar la localización del domicilio?',
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary",
          handler: blah => {
            console.log("Confirm Cancel: blah");
          }
        },
        {
          text: "Confirmar",
          cssClass: "secondary",
          handler: () => {
            this.verificacionDomicilio = true;
          }
        }
      ]
    })
    await alert.present()
  }

}
