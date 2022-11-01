import { Injectable } from '@angular/core';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Storage } from '@ionic/storage';
import { RestService } from './rest.service';
//import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse, BackgroundGeolocationEvents } from '@ionic-native/background-geolocation/ngx';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {


  geoPosicion: any;

  constructor(
    private geolocation: Geolocation,
    private storage: Storage,
    private rest: RestService,
    //private backgroundGeolocation: BackgroundGeolocation,
  ) { }

  
  async pushGeolocationSQL() {
    await this.saveLocation();
  }

  async getGeolocation() {
    return new Promise(async (resolve, reject) => {
      try {
        let posicion = await this.geolocation.getCurrentPosition();
        resolve(posicion)
      } catch (error) {
        console.log(error);
        reject(error)
      }
    })
  }


  async saveLocation() {
    this.geoPosicion = await this.getGeolocation();
    let lat = this.geoPosicion.coords.latitude;
    let lng = this.geoPosicion.coords.longitude;
    let idAspuser = await this.storage.get('IdAspUser')
    if (idAspuser !== null) {

      var dateDay = new Date().toISOString();
      let date: Date = new Date(dateDay);
      let ionicDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
      let fecha = ionicDate.toISOString();

      this.rest.saveLocation(lat, lng, idAspuser, fecha)//guarda localmente
      this.rest.guardarSQl(lat, lng, idAspuser, fecha);

    }

  }


  // backGroundGeolocation() {
  //   const config: BackgroundGeolocationConfig = {
  //     desiredAccuracy: 10,
  //     interval: 5000, //300000
  //     fastestInterval: 5000,
  //     notificationTitle: 'Ser0 Móvil',
  //     notificationText: 'Activado',
  //     debug: false, //  enable this hear sounds for background-geolocation life-cycle.
  //     stopOnTerminate: true, // enable this to clear background location settings when the app terminates
  //   };

  //   this.backgroundGeolocation.configure(config)
  //     .then(() => {
  //       this.backgroundGeolocation
  //         .on(BackgroundGeolocationEvents.location)
  //         .subscribe((location: BackgroundGeolocationResponse) => {
  //           //console.log(location);
  //           this.saveLocation(location)
  //         });

  //     });

  //   // start recording location
  //   this.backgroundGeolocation.start();
  //   // If you wish to turn OFF background-tracking, call the #stop method.
  //   this.backgroundGeolocation.stop();
  // }


}
