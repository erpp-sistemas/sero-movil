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
import { BatteryStatus } from '@awesome-cordova-plugins/battery-status/ngx';
import { DblocalService } from './services/dblocal.service';
import { PhotoService } from './services/photo.service';
import { RegisterService } from './services/register.service';
import { Form } from './interfaces';


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
    private batteryStatus: BatteryStatus,
  ) {
    this.initializeApp();
  }


  initializeApp() {
    this.platform.ready().then(() => {
      this.splasScreen.hide();
      this.createDB();
      this.getPermission();
      this.setStatusBar()
      this.push.configuracionInicial();
      this.getTablesSQL();
      this.batteryInit();
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
      await db.executeSql(table.gestores, []);
      await db.executeSql(table.tableRecorrido, []);
      await db.executeSql(table.tableEncuesta, []);
      await db.executeSql(table.tableProcesoGestion, []);
      await db.executeSql(table.tableCortes, []);
      await db.executeSql(table.tableCatalogoTareas, []);
      await db.executeSql(table.tableEncuestaGeneral, [])
      await db.executeSql(table.tableRegisterEncuestaGeneral, [])
      await db.executeSql(table.tableContadorRegisterEncuesta, [])
      await db.executeSql(table.tableRegisterFormDynamic, [])

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


  async getTablesSQL() {
    const forms = await this.rest.getTablesSQL();
    const id_forms = forms.map(f => f.route_app);
    const id_forms_check = JSON.stringify(this.wihoutDuplicated(id_forms));
    await this.storage.set('IdsForms', id_forms_check);

    const agrupadoPorId = forms.reduce((resultado, objeto) => {
      // Verificar si ya existe un array para el id actual
      if (!resultado[objeto.id_form]) {
        // Si no existe, crear un nuevo array
        resultado[objeto.id_form] = [];
      }

      // Agregar el objeto al array correspondiente al id
      resultado[objeto.id_form].push(objeto);

      return resultado;
    }, {});
    this.setTablesLocal(agrupadoPorId)
  }

  wihoutDuplicated(data: any[]) {

    const arraySinDuplicados = data.filter((valor, indice, self) => {
      return self.indexOf(valor) === indice;
    });

    return arraySinDuplicados
  }

  async setTablesLocal(data: any) {
    console.log(data);
    let tables_name = [];
    for (const clave in data) {
      if(data.hasOwnProperty(clave)) {
        await this.dblocalService.createTableLocal(data[clave]);
        await this.saveFieldStorage(data[clave])
        let arr = data[clave]
        tables_name.push(arr[0].nombre_form)
      }
    }
    await this.saveNameTablesStorage(tables_name)
  }

  async saveFieldStorage(data: Form[]) {

    const id_form = data[0].route_app
    let info_form = []

    for (let d of data) {
      info_form.push({
        id_form: d.id_form,
        field: d.field,
        type_field_form: d.type_field_form,
        nombre_form: d.nombre_form,
        type: d.type,
        type_form: d.type_form,
        options_select: d.options_select,
        route_app: d.route_app,
        icono: d.icono,
        name_photo: d.name_photo,
        have_signature: d.have_signature,
        send_notification: d.send_notification,
        mandatory: d.mandatory
      })
    }

    await this.storage.set(id_form, JSON.stringify(info_form))

  }

  async saveNameTablesStorage(tables: any[]) {
    await this.storage.set('TablesNames', JSON.stringify(tables))
  }


}
