import { Component, OnInit } from '@angular/core';
import { RestService } from '../services/rest.service';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { MessagesService } from '../services/messages.service';
import { ModalController, Platform, LoadingController } from '@ionic/angular';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Router } from '@angular/router';
import { DblocalService } from '../services/dblocal.service';


@Component({
  selector: 'app-servicios-publicos',
  templateUrl: './servicios-publicos.page.html',
  styleUrls: ['./servicios-publicos.page.scss'],
})
export class ServiciosPublicosPage implements OnInit {

  account: string = "";
  idTareaGestor: number = 0;
  fechaCaptura: string = "";
  idAspuser: string = "";
  latitud: number = 0;
  longitud: number = 0;


  idPlazas = [];
  plazas = [];
  id_plaza: number;
  fechaActual: string = '';
  loading: any;


  imgs: any;
  //imgs2: any;
  infoImage: any[];
  image: string = "";
  indicadorImagen: number = 0;
  //indicadorImagen2: number = 0;
  takePhoto: boolean = false;
  isPhoto: boolean = false;
  idServicio: number = 0;
  //idServicio2: number = 0;
  idServicioMandar: number; // este es el que se va a mandar a guardar en la tabla dependiendo si es la evidencia 1 o 2
  observacion: string = '';
  nombrePlaza: string = '';
  plazasServicios: any;
  idIncidencia1Selected: boolean = false;
  //idIncidencia2Selected: boolean = false;
  colorIncidencia1: string = '';
  //colorIncidencia2: string = '';
  listaServiciosPublicos:any;

  sliderOpts = {
    zoom: true,
    slidesPerView: 1.55,
    spaceBetween: 2,
    centeredSlides: true
  };


  constructor(
    private storage: Storage,
    private rest: RestService,
    private dblocal: DblocalService,
    private camera: Camera,
    private webview: WebView,
    private mensaje: MessagesService,
    private geolocation: Geolocation,
    private platform: Platform,
    private loadingController: LoadingController,
    private router: Router
  ) {
    this.imgs = [{ imagen: "assets/img/imgs.png" }];
    //this.imgs2 = [{ imagen: "assets/img/imgs.png" }];
  }

  async ngOnInit() {
    this.getFechaActual();
    await this.mostrarServiciosPublicos(this.id_plaza)
    this.idAspuser = await this.storage.get('IdAspUser');
  }

  async ionViewDidEnter() {
    await this.platform.ready();
    this.obtenerPlazasUsuario();
    this.idIncidencia1Selected = false;
    this.colorIncidencia1 = '';

    // this.idIncidencia2Selected = false;
    // this.colorIncidencia2 = '';

  }


  async obtenerPlazasUsuario() {
    this.plazasServicios = await this.dblocal.obtenerPlazasSQL();
    console.log(this.plazasServicios);

    // tomamos el primer registro para ponerlo como defauult en el select
    this.id_plaza = this.plazasServicios[0].id_plaza;
    this.nombrePlaza = this.plazasServicios[0].plaza;

    console.log("idPlaza " + this.id_plaza);
    console.log("Nombre plaza " + this.nombrePlaza);
    // const servicios = await this.rest.mostrarServicios(this.id_plaza);
  }

  async deletePhoto(img, numero_incidencia) {
    console.log(img);
    console.log(this.imgs);

    if (numero_incidencia == 1) {
      console.log("Borrar foto de incidencia 1");
      for (let i = 0; i < this.imgs.length; i++) {
        console.log(this.imgs[i].imagen);
        if (this.imgs[i].imagen == img) {
          this.imgs.splice(i, 1);
        } else {
          console.log("No hay coincidencias");
        }
      }
    } 
    // else if (numero_incidencia == 2) {
    //   console.log("Borrar foto de incidencia 2");
    //   for (let i = 0; i < this.imgs2.length; i++) {
    //     console.log(this.imgs2[i].imagen);
    //     if (this.imgs2[i].imagen == img) {
    //       this.imgs2.splice(i, 1);
    //     } else {
    //       console.log("No hay coincidencias");
    //     }
    //   }
    // }
    //borrara la foto trayendo la imagen de la tabla y mandando a llamar al metodo delete del restservice
    this.infoImage = await this.rest.getImageLocalServicios(img);
    console.log(this.infoImage[0]);
  }

  async resultPlaza(event) {
    let idPlaza = event.detail.value;
    let servicios = await this.rest.mostrarServicios(idPlaza);
    this.nombrePlaza = servicios[0].plaza;
    console.log(this.id_plaza);
    this.mostrarServiciosPublicos(this.id_plaza);
    console.log(this.nombrePlaza);
  }

  resultIncidencia( event ) {
   
    console.log(event.detail.value);
    this.idIncidencia1Selected = true;
    // if (tipo == 1) {
    //   this.idIncidencia1Selected = true;
    //   this.colorIncidencia1 = 'primary'
    // } 
    // else if (tipo == 2) {
    //   this.idIncidencia2Selected = true;
    //   this.colorIncidencia2 = 'primary'
    // }
  }

  async takePic(type) {
    let tipo = 'Evidencia servicios públicos'
    if (type == 1) {
      this.idServicioMandar = this.idServicio;
      this.photoEvidencia1(tipo);
    } 
    // else if (type == 2) {
    //   this.idServicioMandar = this.idServicio2;
    //   this.photoEvidencia2(tipo);
    // }
  }

  photoEvidencia1(tipo) {
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
          this.idAspuser,
          this.image,
          //this.account,
          fecha,
          rutaBase64,
          //this.idAspuser,
          //this.idTareaGestor,
          tipo,
          this.idServicioMandar,
          this.nombrePlaza
        );
      })
      .catch(error => {
        console.error(error);
      });
  }

  // photoEvidencia2(tipo) {
  //   var dateDay = new Date().toISOString();
  //   let date: Date = new Date(dateDay);
  //   let ionicDate = new Date(
  //     Date.UTC(
  //       date.getFullYear(),
  //       date.getMonth(),
  //       date.getDate(),
  //       date.getHours(),
  //       date.getMinutes(),
  //       date.getSeconds()
  //     )
  //   );

  //   let fecha = ionicDate.toISOString();

  //   let options: CameraOptions = {
  //     quality: 40,
  //     correctOrientation: true,
  //     destinationType: this.camera.DestinationType.FILE_URI,
  //     sourceType: this.camera.PictureSourceType.CAMERA,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE
  //   };
  //   this.camera
  //     .getPicture(options)
  //     .then(imageData => {
  //       this.indicadorImagen2 = this.indicadorImagen2 + 1;
  //       let rutaBase64 = imageData;
  //       this.image = this.webview.convertFileSrc(imageData);
  //       console.log(rutaBase64, this.image);
  //       this.isPhoto = false;
  //       this.takePhoto = true;
  //       this.imgs2.push({ imagen: this.image });
  //       if (this.indicadorImagen2 == 1) {
  //         this.imgs2.splice(0, 1);
  //       }

  //       this.saveImage(
  //         this.id_plaza,
  //         this.idAspuser,
  //         this.image,
  //         //this.account,
  //         fecha,
  //         rutaBase64,
  //         //this.idAspuser,
  //         //this.idTareaGestor,
  //         tipo,
  //         this.idServicioMandar,
  //         this.nombrePlaza
  //       );
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // }

  saveImage(id_plaza, idAspUser, image, fecha, rutaBase64, tipo, idServicioMandar, nombrePlaza) {
    this.rest
      .saveImageServicios(
        id_plaza,
        idAspUser,
        image,
        fecha,
        rutaBase64,
        tipo,
        idServicioMandar,
        nombrePlaza
      )
      .then(res => {
        console.log(res);
        this.mensaje.showToast("Se almacenó la imagen correctamente");
      });
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
    console.log("Esta es la fecha Actual :::::::::::" + this.fechaActual);
  }


  async verify() {
    if (this.takePhoto == false) {
      this.mensaje.showAlert("Captura minimo una foto para poder terminar la gestion");
    } else {
      this.loading = await this.loadingController.create({
        message: "Obteniendo la ubicación de esta gestión y guardando...."
      });

      await this.loading.present();


      this.geolocation.getCurrentPosition().then(async (resp) => {

        if (resp) {
          this.latitud = resp.coords.latitude;
          this.longitud = resp.coords.longitude
          console.log("La latitud es", this.latitud);
          console.log("La longitud es ", this.longitud);
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
            idAspUser: this.idAspuser,
            idServicio: this.idServicio,
            //idServicio2: this.idServicio2,
            observacion: this.observacion,
            fechaCaptura: this.fechaCaptura,
            latitud: this.latitud,
            longitud: this.longitud
          };
          await this.gestionServiciosPublicos(data);
          this.loading.dismiss();

        } // if
      }).catch(async (error) => {
        console.log("No se pudo obtener la geolocalizacion " + error);
        //this.latitud = this.infoAccount[0].latitud;
        //this.longitud = this.infoAccount[0].longitud;
        console.log(`La latitud de implementta es ${this.latitud} y la longitud de implementta es ${this.longitud}`);
        this.loading.dismiss();

        this.loading = await this.loadingController.create({
          message: 'Guardando reporte'
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
          idAspUser: this.idAspuser,
          idServicio: this.idServicio,
          observacion: this.observacion,
          fechaCaptura: this.fechaCaptura,
          latitud: this.latitud,
          longitud: this.longitud
        };
        await this.gestionServiciosPublicos(data);
        this.loading.dismiss();

      }); // catch      
    }

  }


  async gestionServiciosPublicos(data) {
    await this.rest.gestionServiciosPublicos(data);
    console.log(data);
    this.borrarCampos();
    this.router.navigateByUrl('/home');
  }

  borrarCampos() {
    this.observacion = '';
    this.idServicio = 0;
    //this.idServicio2 = 0;
    this.imgs = [{ imagen: "assets/img/imgs.png" }];
    //this.imgs2 = [{ imagen: "assets/img/imgs.png" }];
  }

  mostrarIncidencias(event) {
    console.log(event.detail.value);
  }

  async mostrarServiciosPublicos(id_plaza) {
    this.listaServiciosPublicos = await this.rest.mostrarServiciosPublicos(id_plaza);
    console.log(this.listaServiciosPublicos);
  }


}


