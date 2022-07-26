import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { RestService } from '../app/services/rest.service';
// import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AuthService } from './services/auth.service';
import { QuerysService } from './services/querys.service';

import { AngularFirestore } from '@angular/fire/firestore';
import { MessagesService } from './services/messages.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse, BackgroundGeolocationEvents } from '@ionic-native/background-geolocation/ngx';
//import { auth } from 'firebase';
//import { UsersFirebaseService } from './services/users-firebase.service';

import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {


  login: boolean;
  _router: any;

  constructor(
    private query: QuerysService,
    private platform: Platform,
    private backgroundGeolocation: BackgroundGeolocation,
    private splasScreen: SplashScreen,
    private statusBar: StatusBar,
    private sqlite: SQLite,
    private rest: RestService,
    // private androidPermissions: AndroidPermissions,
    private db: AngularFirestore,
    private auth: AuthService,
    private message: MessagesService,
    private storage: Storage,
    private router: Router,
    private androidPermissions: AndroidPermissions,
  ) {
    this.initializeApp();

  }


  initializeApp() {
    this.platform.ready().then(() => {

      this.splasScreen.hide();
      this.statusBar.styleBlackOpaque();
      this.createDB();
      this.backGroundGeolocation();
      this.getPermission();
    })
  }


  async getPermission() {
    this.androidPermissions.requestPermissions(
      [
        this.androidPermissions.PERMISSION.CAMERA,
        this.androidPermissions.PERMISSION.READ_PHONE_STATE,
        this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
      ])
  }

  createDB() {
    let table = this.query.getTables();
    this.sqlite.create({
      name: 'erppMovil.db',
      location: 'default'
    }).then(async (db: SQLiteObject) => {
      // Pasando el db al servicio
      this.rest.setDatabase(db);

      await db.executeSql(table.tableSero, []);
      await db.executeSql(table.tableInspeccion, []);
      await db.executeSql(table.tableCartaInvitacion, []);
      await db.executeSql(table.tableLegal, []);
      await db.executeSql(table.tableInspeccionAntenas, []);
      await db.executeSql(table.tableServiciosPublicos, []);
      await db.executeSql(table.tableFotos, []);
      await db.executeSql(table.tableFotosServicios, []);
      await db.executeSql(table.tableServicios, []);
      await db.executeSql(table.tableDescargaServicios, []);
      await db.executeSql(table.tableListaServiciosPublicos, []);
      await db.executeSql(table.tableEmpleadosPlaza, []);
      await db.executeSql(table.tableRecorrido, []);
      await db.executeSql(table.tableEncuesta, []);

    }).catch(error => console.log("Error en bd", error));
  }


  backGroundGeolocation() {

    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 10,
      interval: 300000, //300000
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
            //console.log(location);
            this.saveLocation(location)
          });

      });

    // start recording location
    this.backgroundGeolocation.start();
    // If you wish to turn OFF background-tracking, call the #stop method.
    this.backgroundGeolocation.stop();
  }

  async saveLocation(location) {
    let lat = location.latitude;
    let lng = location.longitude
    let idAspuser = await this.storage.get('IdAspUser')
    //let idPlaza = await this.storage.get('IdPlaza')
    if (idAspuser == null || idAspuser == undefined) {
    } else {
      //console.log(idAspuser, 'el idaspuser del recorrido')
      
      //console.log('Sesion activa')

      var dateDay = new Date().toISOString();
      let date: Date = new Date(dateDay);
      let ionicDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
      let fecha = ionicDate.toISOString();

      this.rest.saveLocation(lat, lng, idAspuser, fecha)//guarda localmente
      this.rest.guardarSQl(lat, lng, idAspuser, fecha);
      
    }

  }



}
