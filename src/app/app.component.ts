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
//import { auth } from 'firebase';
//import { UsersFirebaseService } from './services/users-firebase.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private query: QuerysService,
    private platform: Platform,
    private splasScreen: SplashScreen,
    private statusBar: StatusBar,
    private sqlite: SQLite,
    private rest: RestService,
   // private androidPermissions: AndroidPermissions,
    private db: AngularFirestore,
    private auth: AuthService,
    private message: MessagesService,
    private storage: Storage
  ) {
    this.initializeApp();
  }


  initializeApp() {
    this.platform.ready().then( () => {
      
      this.splasScreen.hide();
      this.statusBar.styleBlackOpaque();
      this.createDB();
      // this.getPermission();

    })
  }

  // async getPermission() {
  //   this.androidPermissions.requestPermissions(
  //     [
  //       this.androidPermissions.PERMISSION.CAMERA,
  //       this.androidPermissions.PERMISSION.READ_PHONE_STATE,
  //       this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
  //     ])
  // }

  createDB() {
    let table = this.query.getTables();
    this.sqlite.create({
      name: 'erppMovil.db',
      location: 'default'
    }).then( async(db: SQLiteObject) => {
      this.rest.setDatabase(db);

      await db.executeSql(table.tableAgua, []);
      await db.executeSql(table.tablePredio, []);
      await db.executeSql(table.tableAntenas, []);
      await db.executeSql(table.tablePozos, []);
      await db.executeSql(table.tableInspeccionAgua, []);
      await db.executeSql(table.tableInspeccionPredio, []);
      await db.executeSql(table.tableFotos, []);
      await db.executeSql(table.tableFotosPredio, []);
      await db.executeSql(table.tableAntenas, []);
      await db.executeSql(table.tablePozos, []);
      await db.executeSql(table.tableServicios, []);
      await db.executeSql(table.tableDescargaServicios, []);

    }).catch( error => console.log("Error en bd", error));
  }

}
