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
import { ActionsHistoryPage } from '../actions-history/actions-history.page';


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
  idEstatusPredio: string = ''; // Si es localizado el predio mostrara el formulario
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
  nombreTareaAsignada: string = '';
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
  nombreProceso: string;
  iconoProceso: string;

  sello: boolean = false;
  idMotivoNoPago: number = 0;

  // campos obligatorios
  leyendaEstatusPredio: boolean = false;
  leyendaTipoServicioObligatorio: boolean = false;
  leyendaMotivoNoPago: boolean = false;
  leyendaOtroMotivo: boolean = false;


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

  async getPlaza() {
    this.nombrePlaza = await this.storage.get('NombrePlazaActiva');
    this.id_plaza = await this.storage.get('IdPlazaActiva');
  }

  async getInfoAccount() {
    this.account = await this.storage.get("account");
    this.id_proceso = await this.storage.get('id_proceso');
    this.nombreProceso = await this.storage.get('proceso_gestion');
    this.iconoProceso = await this.storage.get('icono_proceso');
    this.idAspUser = await this.storage.get('IdAspUser');
    this.infoAccount = await this.rest.getInfoAccount(this.account);
    this.propietario = this.infoAccount[0].propietario;
    this.idAccountSqlite = this.infoAccount[0].id;
    this.tareaAsignada = this.infoAccount[0].tarea_asignada;
    this.nombreTareaAsignada = this.infoAccount[0].nombre_tarea_asignada;
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


  // async confirmarFoto(tipo: number) {
  //   const mensaje = await this.alertCtrl.create({
  //     header: "Tomar foto",
  //     subHeader: "Selecciona como tomar la foto ",
  //     buttons: [
  //       {
  //         text: "Camara",
  //         cssClass: "secondary",
  //         handler: () => {
  //           this.takePic(tipo);
  //         }
  //       },
  //       {
  //         text: "Galeria",
  //         cssClass: "secondary",
  //         handler: () => {
  //           this.takePicGallery(tipo)
  //         }
  //       }
  //     ]
  //   });
  //   await mensaje.present();
  // }


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
      //saveToPhotoAlbum: true,
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
        // console.log(rutaBase64, this.image);
        this.isPhoto = false;
        this.imgs.push({ imagen: this.image });
        if (this.indicadorImagen == 1) {
          this.imgs.splice(0, 1);
        }

        this.saveImage(
          this.id_plaza,
          this.nombrePlaza,
          this.image,
          this.account,
          this.fechaCapturaFoto,
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

    //console.log(this.fechaCapturaFoto);

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
        this.imgs.push({ imagen: this.image });
        if (this.indicadorImagen == 1) {
          this.imgs.splice(0, 1);
        }

        this.saveImage(
          this.id_plaza,
          this.nombrePlaza,
          this.image,
          this.account,
          this.fechaCapturaFoto,
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

    await this.validarCamposObligatorios();

    if (this.leyendaEstatusPredio || this.leyendaTipoServicioObligatorio || this.leyendaOtroMotivo || this.takePhotoFachada === false || this.takePhotoEvidencia === false) {
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

    let colocoSello: number = 2;
    if (this.sello === true) {
      colocoSello = 1;
    } else {
      colocoSello = 0;
    }

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
      colocoSello: colocoSello,
      idMotivoNoPago: this.idMotivoNoPago,
      otroMotivoNoPago: this.otroMotivo,
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

    console.log(this.geoPosicion);

    if (this.geoPosicion.coords) {
      this.latitud = this.geoPosicion.coords.latitude;
      this.longitud = this.geoPosicion.coords.longitude;
    } else {
      console.log("No se pudo obtener la geolocalización");
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

    if (this.idEstatusPredio === '') {
      this.leyendaEstatusPredio = true;
      return;
    }

    if (this.idEstatusPredio === '4' || this.idEstatusPredio === '3' || this.idEstatusPredio === '2') { // es predio no localizado
      //this.takePhoto = true; no hacen falta las fotos
      this.takePhotoFachada = true;
      this.takePhotoEvidencia = true;
      this.hideLeyendas();
      return;
    }

    if (this.idMotivoNoPago === 0) {
      this.leyendaMotivoNoPago = true;
    }

    if (this.idMotivoNoPago == 5 && this.otroMotivo === '') {
      this.leyendaOtroMotivo = true;
    }

    if (this.idTipoServicio === 0) {
      this.leyendaTipoServicioObligatorio = true;
    }


    if (this.idEstatusPredio !== '1') {
      this.numeroNiveles = 0;
    }

  }

  hideLeyendas() {
    this.leyendaTipoServicioObligatorio = false;
    this.leyendaEstatusPredio = false;
    this.leyendaOtroMotivo = false;
    this.leyendaMotivoNoPago = false;
  }


  async gestionCarta(data) {
    //console.log(data);
    //console.log(this.id_proceso);
    if (this.id_proceso === 7) {
      await this.rest.gestionCortes(data)
    } else {
      this.rest.gestionCartaInvitacion(data)
        .then((respuesta: string) => this.mensaje.showToast(respuesta))
        .catch((error: string) => this.mensaje.showToast(error));
    }
  }

  async sendGestionServer() {
    // sincronizar la gestion
    try {
      await this.rest.sendCartaByIdServicioAccount(this.idServicioPlaza, this.account)
    } catch (error) {
      console.log(error);
    }
  }

  async sendEncuestaServer() {
    console.log("Se realizo la encuesta procedo a enviarla");
    try {
      await this.rest.sendEncuestaByCuenta(this.idServicioPlaza, this.account);
    } catch (error) {
      console.log(error);
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

  resultEstatusPredio(event) {
    let estatus = event.detail.value;
    this.leyendaEstatusPredio = false
    if (estatus === '1') {
      this.activaFormulario = true;
      this.desactivaBotonesCamara = false;
    } else {
      this.activaFormulario = false;
      this.desactivaBotonesCamara = true;
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

  async goActions() {
    let idPlaza = Number(this.id_plaza);
    const modal = await this.modalController.create({
      component: ActionsHistoryPage,
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
    console.log(this.encuestaRealizada);

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
          handler: blah => {
            console.log("Confirm Cancel: blah");
          }
        },
        {
          text: "Confirmar",
          cssClass: "secondary",
          handler: () => {
            this.sello = true;
          }
        }
      ]
    });
    await alert.present();
  }

}
