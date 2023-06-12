import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
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


  constructor(
    private router: Router,
    private callNumber: CallNumber,
    public alertController: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private platform: Platform,
    private storage: Storage,
    private rest: RestService,
    private faceSdk: FaceSDK,
    private userService: UsersService,
    private message: MessagesService,
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

    if (this.latitud == "" || this.latitud == null || this.latitud == undefined) {
      alert("La ubicación no esta disponible")
    } else {

      this.presentFace().then(async message => {

        this.message.showToast(message)

        this.getUrlUser().then(message => {

          this.matchFaces().then((data: any) => {
            if (data.estatus === 'passed') {
              this.checar(tipo)
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

  checar(tipo: any) {
    var dateDay = new Date().toISOString();
    let date: Date = new Date(dateDay);
    let ionicDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
    let fecha = ionicDate.toISOString();

    this.userService.uploadPhotoUser(imageSelfie.bitmap, this.email, fecha).then((response: any) => {
      //console.log(response)
      if (response.estatus) {
        let url_photo = response.urlPhoto
        // https://fotos-sero-movil.s3.amazonaws.com/antonio.ticante%40ser0.mx-2023-06-08T14%3A31%3A10?AWSAccessKeyId=AKIA5NSDPBH32ZG3HSMX&Expires=1986256271&Signature=FQxQaqyjRkP0myJoX%2Br2NoFJq9c%3D
        let a = url_photo.split("&");
        let b = a[0];
        let b1 = b.split(":");
        let b2 = b1[0];
        let b3 = b1[1];
        let c = a[1];
        let d = a[2];
        
        //let parametros = +tipo + ',' + this.idAspUser + ',' + '"' + fecha + '"' + ',' + this.latitud + ',' + this.longitud + ',' + 
        let parametros = `${tipo}, ${this.idAspUser}, '${fecha}', ${this.latitud}, ${this.longitud}, '${b2}', '${b3}', '${c}', '${d}' `
        this.registerBD(parametros)
      }
    })

  }

  registerBD(parameters: string) {
    this.rest.registroChecador(parameters).then(res => {
      this.loading.dismiss();
      alert(res[0].mensaje)
    })
  }

  async confirmar(tipo: any) {
    let tipoRegister = tipo == 1 ? 'entrada' : 'salida'
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

      this.loading = await this.loadingCtrl.create({
        message: 'Obteniendo foto Ser0',
        spinner: 'dots'
      })

      await this.loading.present()

      let img = await this.rest.obtenerFotoUserSQL();
      let url = img[0].foto;
      //url = 'https://scontent.fmex28-1.fna.fbcdn.net/v/t1.18169-9/21743117_1812963972077655_9068768826820206722_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=174925&_nc_ohc=WAOqPX7YOIgAX8zrNz8&_nc_ht=scontent.fmex28-1.fna&oh=00_AfDlppjmgxjawwl_CMxIAVQwlZq5ErZW-qHjUFW1egLAIg&oe=64A999D0'

      this.userService.getUrlFoto(url).subscribe((response: Blob) => {
        const reader = new FileReader()
        reader.onload = () => {
          const imageBase64 = reader.result
          this.setImageSero(imageBase64.toString(), Enum.ImageType.PRINTED)
        }
        if (response) {
          reader.readAsDataURL(response)
          this.loading.dismiss()
          resolve("Imagen ser0 cargada")
        }
      }, err => {
        console.log(err)
        reject(err)
      })
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






