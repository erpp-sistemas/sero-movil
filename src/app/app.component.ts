import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { RestService } from '../app/services/rest.service';
import { QuerysService } from './services/querys.service';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { PushService } from './services/push.service';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse, BackgroundGeolocationEvents } from '@ionic-native/background-geolocation/ngx';
import { Storage } from '@ionic/storage';
//import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { BatteryStatus } from '@awesome-cordova-plugins/battery-status/ngx';
import { DblocalService } from './services/dblocal.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {


  login: boolean;
  router: any;
  intervalTracking: any;

  geoPosicion: any = {};
  battery: any = null
  porcentaje: number = 0

  constructor(
    private query: QuerysService,
    private platform: Platform,
    private splasScreen: SplashScreen,
    private statusBar: StatusBar,
    private sqlite: SQLite,
    private rest: RestService,
    private dblocal: DblocalService,
    private androidPermissions: AndroidPermissions,
    private push: PushService,
    private backgroundGeolocation: BackgroundGeolocation,
    private storage: Storage,
    private batteryStatus: BatteryStatus
  ) {
    this.initializeApp();
  }


  initializeApp() {
    this.platform.ready().then(() => {
      this.splasScreen.hide();
      this.statusBar.styleBlackOpaque();
      this.createDB();
      this.getPermission();
      this.backGroundGeolocation();
      this.push.configuracionInicial();
      this.battery = this.batteryStatus.onChange().subscribe(status => {
        this.porcentaje = status.level
        this.sendPorcentajePila()
      });
      // this.backGroundMode.enable();
      // this.backGroundMode.disableBatteryOptimizations()
      // this.backGroundMode.disableWebViewOptimizations()
    })
  }

  async getPermission() {
    this.androidPermissions.requestPermissions(
      [
        //this.androidPermissions.PERMISSION.CAMERA,
        //this.androidPermissions.PERMISSION.READ_PHONE_STATE,
        this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
        this.androidPermissions.PERMISSION.SEND_SMS
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
      this.dblocal.setDatabase(db)

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
      await db.executeSql(table.tableProcesoGestion, []);
      await db.executeSql(table.tableCortes, []);
      await db.executeSql(table.tableCatalogoPartidos, []);
      await db.executeSql(table.tableCatalogoAlianzas, []);
      await db.executeSql(table.tableCatalogoTareas, []);
      await db.executeSql(table.tableEncuestaGeneral, [])
      await db.executeSql(table.tableRegisterEncuestaGeneral, [])
      await db.executeSql(table.tableContadorRegisterEncuesta, [])

    }).catch(error => console.log("Error en bd", error));
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
    // console.log(lat)
    // console.log(lng)
    let idAspuser = await this.storage.get('IdAspUser')
    //let idPlaza = await this.storage.get('IdPlaza')
    if (idAspuser == null || idAspuser == undefined) {
    } else {
      //console.log(idAspuser, 'el idaspuser del recorrido')
      var dateDay = new Date().toISOString();
      let date: Date = new Date(dateDay);
      let ionicDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
      let fecha = ionicDate.toISOString();

      this.rest.saveLocation(lat, lng, idAspuser, fecha)//guarda localmente
      this.rest.guardarSQl(lat, lng, idAspuser, fecha);

    }

  }

  async sendPorcentajePila() {
    var dateDay = new Date().toISOString();
    let date: Date = new Date(dateDay);
    let ionicDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
    let fecha = ionicDate.toISOString();
    let idAspuser = await this.storage.get('IdAspUser')
    
    this.rest.registerPorcentajePila(idAspuser, this.porcentaje, fecha).then(message => {
      console.log(message)
    }).catch(error => {
      console.log("No se pudo insertar el porcentaje de la pila")
    })
    
  }


}
