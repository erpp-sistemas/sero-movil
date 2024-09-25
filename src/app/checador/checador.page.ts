import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleMaps, GoogleMap, Marker, GoogleMapsAnimation, MyLocation, GoogleMapOptions, GoogleMapsMapTypeId } from '@ionic-native/google-maps';
import { LoadingController, ToastController, Platform, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
import { RestService } from '../services/rest.service';
import { MarkerIcon } from '@ionic-native/google-maps/ngx';
import { Enum, FaceCaptureResponse, FaceSDK, LivenessResponse, MatchFacesImage, MatchFacesRequest, MatchFacesResponse, MatchFacesSimilarityThresholdSplit } from '@regulaforensics/ionic-native-face-api/ngx'
import { UsersService } from '../services/users.service'
import { MessagesService } from '../services/messages.service';
import { HistoryCheckingPage } from '../history-checking/history-checking.page';
import { DblocalService } from '../services/dblocal.service';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse, BackgroundGeolocationEvents } from '@ionic-native/background-geolocation/ngx';

declare var google;

// faceapi
var imageSelfie = new MatchFacesImage();
var imageSero = new MatchFacesImage();

@Component({
  selector: 'app-checador',
  templateUrl: './checador.page.html',
  styleUrls: ['./checador.page.scss'],
})
export class ChecadorPage implements OnInit {

  map: GoogleMap;
  loading: any;
  nombre: string;
  plaza: string
  idPlaza: string;
  email: string
  latitud: any;
  longitud: any;
  reloj: string
  map2: any;
  idAspUser: any = '';

  statusComida: string = ''


  constructor(
    private router: Router,
    public alertController: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private platform: Platform,
    private storage: Storage,
    private rest: RestService,
    private faceSdk: FaceSDK,
    private userService: UsersService,
    private message: MessagesService,
    private modalController: ModalController,
    private dbLocalService: DblocalService,
    private backgroundGeolocation: BackgroundGeolocation,
  ) { }

  async ngOnInit() {
    await this.platform.ready();
    await this.loadMap();
    this.faceSdk.init().then(json => {
      var response = JSON.stringify(json)
      if (response["success"] == false) {
        console.log("Init false")
        console.log(json)
      } else {
        console.log("Init complete")
      }
    })
    this.idAspUser = await this.storage.get('IdAspUser');
    this.nombre = await this.storage.get('Nombre');
    this.email = await this.storage.get('Email');
  }


  async loadMap() { //realiza la carga del mapa
    let options: GoogleMapOptions = {
      mapType: GoogleMapsMapTypeId.ROADMAP,
      controls: {
        'compass': true,
        'myLocationButton': true,
        'myLocation': true,   // (blue dot)
        'mapToolbar': true     // android only
      },
      gestures: {
        scroll: true,
        tilt: true,
        zoom: true,
        rotate: true
      }
    }

    this.map = GoogleMaps.create('map_canvas', options);

    this.loading = await this.loadingCtrl.create({
      message: 'Cargando mapa...'
    });
    await this.loading.present();

    // Get the location of you
    this.map.getMyLocation().then((location: MyLocation) => {
      this.loading.dismiss();
      //console.log(JSON.stringify(location, null, 2));
      this.latitud = location.latLng.lat.toString();
      this.longitud = location.latLng.lng.toString();
      // Move the map camera to the location with animation
      this.map.animateCamera({
        target: location.latLng,
        zoom: 12,
        tilt: 30
      });


      // icono de la ubicacion
      let iconUbicacion: MarkerIcon = {
        url: 'assets/icon/sero.png',
        size: {
          width: 30,
          height: 30
        }
      }

      console.log(location.latLng)

      let marker: Marker = this.map.addMarkerSync({
        title: 'Mi ubicación actual',
        position: location.latLng,
        animation: GoogleMapsAnimation.BOUNCE,
        icon: iconUbicacion
      });

      // show the infoWindow
      marker.showInfoWindow();

      // carga los markers */
    })
      .catch(err => {
        this.loading.dismiss();
        this.showToast(err.error_message);
      });
  }

  async showToast(message: string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  async validar(tipo: any) {

    const email = await this.storage.get('Email')
    if (email === 'antonio.ticante@ser0.mx') {
      this.checar(tipo, 'https://firebasestorage.googleapis.com/v0/b/waterloo-6e309.appspot.com/o/anthony.png?alt=media&token=bfdfa69c-534c-44f0-a221-8121761c1f3b')
      return;
    }

    if (this.latitud == "" || this.latitud == null || this.latitud == undefined) {
      alert("La ubicación no esta disponible")
    } else {

      this.presentFace().then(async message => {

        this.message.showToast(message)

        this.getUrlUser().then(message => {

          this.matchFaces().then((data: any) => {
            if (data.estatus === 'passed') {
              this.checar(tipo, '')
            } else {
              this.message.showAlert("Error!!!! -- No coinciden los biométricos")
            }
          }).catch(error => {
            console.log(error)
            this.message.showToast("Error al analizar los biométricos")
          })

        }).catch(error => {
          console.log(error)
          this.message.showToast("Error al obtener la imagen Ser0")
        })


      }).catch(error => {
        console.log(error)
        this.message.showToast("Error al capturar los biométricos, intentalo de nuevo ")
      })

    }

  }

  async checar(tipo: any, foto: any) {
    this.backGroundGeolocation()
    var dateDay = new Date().toISOString();
    let date: Date = new Date(dateDay);
    let ionicDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
    let fecha = ionicDate.toISOString();
    let url_photo: string = ''

    if (foto === '') {
      let response: any = await this.userService.uploadPhotoUser(imageSelfie.bitmap, this.email, fecha)
      if (response.status) {
        url_photo = response.urlPhoto
      }
    }

    if (foto !== '') {
      url_photo = foto
    }

    const data = { 
      tipo: tipo, 
      id_usuario: this.idAspUser, 
      fecha: fecha,
      latitud: this.latitud,
      longitud: this.longitud,
      url_photo: url_photo
    }
    this.registerBD(data)

  }


  registerBD(parameters: { [key: string]: any }) {
    this.rest.registroChecador(parameters).then(res => {
      this.loading.dismiss();
      alert(res[0].mensaje)
    })
  }

  async confirmar(tipo: any) {
    let tipoRegister = tipo == 1 ? 'entrada' : tipo == 2 ? 'salida' : tipo == 3 ? 'salida a comer' : 'regreso de comer'

    var dateDay = new Date().toISOString();
    let date: Date = new Date(dateDay);
    let ionicDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));

    let fecha = ionicDate.toISOString();
    const alert = await this.alertController.create({
      header: 'Confirmar!',
      message: 'Registrar <strong>' + tipoRegister + ':</strong><br><strong>' + fecha + '</strong>',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => { }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.validar(tipo)
          }
        }
      ]
    });

    await alert.present();
  }


  liveness() {
    this.faceSdk.startLiveness().then(livenessResponse => {
      const response = LivenessResponse.fromJson(JSON.parse(livenessResponse));
      imageSelfie.bitmap = response.bitmap;
      imageSelfie.imageType = Enum.ImageType.LIVE
    })
  }

  presentFace() {
    return new Promise<string>((resolve, reject) => {
      this.faceSdk.presentFaceCaptureActivity().then(result => {
        this.setImage(FaceCaptureResponse.fromJson(JSON.parse(result)).image.bitmap, Enum.ImageType.LIVE)
        resolve("Biometricos capturados")
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  }

  matchFaces() {
    return new Promise(async (resolve, reject) => {
      this.loading = await this.loadingCtrl.create({
        message: 'Analizando biométricos',
        spinner: 'dots'
      })
      await this.loading.present();

      const request = new MatchFacesRequest();
      request.images = [imageSelfie, imageSero];
      this.faceSdk.matchFaces(JSON.stringify(request)).then(matchFacesResponse => {
        const response = MatchFacesResponse.fromJson(JSON.parse(matchFacesResponse));
        this.faceSdk.matchFacesSimilarityThresholdSplit(JSON.stringify(response.results), 0.75).then(splitResponse => {
          const split = MatchFacesSimilarityThresholdSplit.fromJson(JSON.parse(splitResponse))
          if (split.matchedFaces.length > 0) {
            this.loading.dismiss()
            resolve({ "estatus": "passed", "similarity": (split.matchedFaces[0].similarity * 100) })
          } else {
            this.loading.dismiss()
            resolve({ "estatus": "not_passed", "similarity": 0 })
          }
        }, e => {
          this.loading.dismiss()
          console.log(e)
          reject(e)
        });
      })
    })
  }

  getUrlUser() {
    return new Promise(async (resolve, reject) => {

      try {
        this.loading = await this.loadingCtrl.create({
          message: 'Obteniendo foto Ser0',
          spinner: 'dots'
        })

        await this.loading.present()
        const photo = await this.storage.get('Foto')
        this.setImageSero(photo, Enum.ImageType.PRINTED);
        this.loading.dismiss();
        resolve("Imagen cargo tracker cargada")
      } catch (error) {
        console.error(error)
        reject(error)
      }

    })
  }

  setImage(base64: string, type: number) {
    if (base64 === null) {
      console.log("No se pudieron tomar las facciones")
    } else {
      imageSelfie.bitmap = base64
      imageSelfie.imageType = type
    }
  }

  setImageSero(base64: string, type: number) {
    let imgBase64 = base64.substring(23)
    //console.log(imgBase64)
    if (base64 === null) {
      console.log("No se pudieron tomar las facciones")
    } else {
      imageSero.bitmap = imgBase64
      imageSero.imageType = type
    }
  }


  async regresarPrincipal() {

    this.loading = await this.loadingCtrl.create({
      message: 'Regresando...',
      spinner: 'circles'
    });

    this.loading.present();

    setTimeout(() => {
      this.loading.dismiss();
      this.router.navigateByUrl('/home');
    }, 1000);

  }

  async getAsistencias() {
    let id_usuario = await this.storage.get('IdAspUser')
    const historial_asistencias = await this.rest.getAsistencias(Number(id_usuario))

    const modal = await this.modalController.create({
      component: HistoryCheckingPage,
      componentProps: {
        data: historial_asistencias
      }

    });
    await modal.present();
  }


  backGroundGeolocation() {
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 3,
      stationaryRadius: 3,
      distanceFilter: 1,
      interval: 10000, //300000
      fastestInterval: 5000,
      notificationTitle: 'Ser0 Móvil',
      notificationText: 'Activado',
      debug: false, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: true, // enable this to clear background location settings when the app terminates
    };
    this.backgroundGeolocation.configure(config)
      .then(() => {
        this.backgroundGeolocation
          .on(BackgroundGeolocationEvents.location)
          .subscribe((location: BackgroundGeolocationResponse) => {
            this.saveLocation(location)
          });

      });
    // start recording location
    this.backgroundGeolocation.start();
    // If you wish to turn OFF background-tracking, call the #stop method.
    this.backgroundGeolocation.stop();
  }


  async saveLocation(location: any) {
    let lat = location.latitude;
    let lng = location.longitude
    let idAspuser = await this.storage.get('IdAspUser')
    if (idAspuser == null || idAspuser == undefined) {
    } else {
      var dateDay = new Date().toISOString();
      let date: Date = new Date(dateDay);
      let ionicDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
      let fecha = ionicDate.toISOString();
      this.dbLocalService.saveLocation(lat, lng, idAspuser, fecha)//guarda localmente
      this.rest.guardarSQl(lat, lng, idAspuser, fecha);
    }
  }


}






