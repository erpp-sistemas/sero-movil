import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { RestService } from '../app/services/rest.service';
import { QuerysService } from './services/querys.service';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { PushService } from './services/push.service';
import { TrackingService } from './services/tracking.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {


  login: boolean;
  router: any;
  intervalTracking: any;

  constructor(
    private query: QuerysService,
    private platform: Platform,
    private splasScreen: SplashScreen,
    private statusBar: StatusBar,
    private sqlite: SQLite,
    private rest: RestService,
    private androidPermissions: AndroidPermissions,
    private push: PushService,
    private tracking: TrackingService
  ) {
    this.initializeApp();
  }


  initializeApp() {
    this.platform.ready().then(() => {
      this.splasScreen.hide();
      this.statusBar.styleBlackOpaque();
      this.createDB();
      this.getPermission();
      this.push.configuracionInicial();
      this.initTracking();
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

  initTracking() {
    this.intervalTracking = setInterval(async () => {
      await this.tracking.pushGeolocationSQL();
    }, 180000);
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
      await db.executeSql(table.tableProcesoGestion, []);
      await db.executeSql(table.tableCortes, []);

    }).catch(error => console.log("Error en bd", error));
  }


}
