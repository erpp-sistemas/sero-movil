import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { RestService } from '../app/services/rest.service';
import { QuerysService } from './services/querys.service';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { PushService } from './services/push.service';
import { Storage } from '@ionic/storage';
//import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { BatteryStatus } from '@awesome-cordova-plugins/battery-status/ngx';
import { DblocalService } from './services/dblocal.service';
import { PhotoService } from './services/photo.service';
import { RegisterService } from './services/register.service';


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
    private dblocalService: DblocalService,
    private photoService: PhotoService,
    private registerService: RegisterService,
    private androidPermissions: AndroidPermissions,
    private push: PushService,
    private storage: Storage,
    private batteryStatus: BatteryStatus
  ) {
    this.initializeApp();
  }


  initializeApp() {
    this.platform.ready().then(() => {
      this.splasScreen.hide();
      this.createDB();
      this.getPermission();
      this.setStatusBar()
      //this.backGroundGeolocation();
      this.push.configuracionInicial();
      this.batteryInit()
    })
  }

  batteryInit() {
    this.battery = this.batteryStatus.onChange().subscribe(status => {
      this.porcentaje = status.level
      this.sendPorcentajePila()
    });
  }

  setStatusBar() {
    //this.statusBar.styleBlackOpaque();
    this.statusBar.backgroundColorByHexString('#1E1E1E')
  }

  async getPermission() {
    this.androidPermissions.requestPermissions(
      [
        this.androidPermissions.PERMISSION.CAMERA,
        this.androidPermissions.PERMISSION.READ_PHONE_STATE,
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
      this.dblocalService.setDatabase(db)
      this.photoService.setDatabase(db)
      this.registerService.setDatabase(db)

      await db.executeSql(table.tableSero, []);
      await db.executeSql(table.tableInspeccion, []);
      await db.executeSql(table.tableCartaInvitacion, []);
      await db.executeSql(table.tableLegal, []);
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
      await db.executeSql(table.tableCatalogoTareas, []);
      await db.executeSql(table.tableEncuestaGeneral, [])
      await db.executeSql(table.tableRegisterEncuestaGeneral, [])
      await db.executeSql(table.tableContadorRegisterEncuesta, [])

    }).catch(error => console.log("Error en bd", error));
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
