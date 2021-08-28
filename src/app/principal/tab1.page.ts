import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { AlertController, LoadingController, MenuController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthService } from '../services/auth.service';
import { MessagesService } from '../services/messages.service';
import { RestService } from '../services/rest.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  imgAvatar: string = '/assets/avatars/';
  nombre: string = '';
  email: string = '';
  progress: boolean = false;
  progressTotal: number = 0;
  loading: any;
  data: any;
  dataPozos: any;
  total: any;
  alert: any;
  totalPozos: any;
  dataSectores: any;
  // servicios validaciones
  agua: boolean;
  predio: boolean;
  antenas: boolean;
  pozos: boolean;

  // validaciones para saber si ya se han descargado cuentas
  descargaAgua: boolean;
  descargaPredio: boolean;
  descargaAntenas: boolean;
  descargaPozos: boolean;
  plazas: any = [];
  idPlazas: any = [];
  id_plaza: number = 0; // select option de plaza
  plaza: number = 0;
  selecciona: boolean = false;

  plazaServicioDescarga = [];
  login: boolean;

  constructor(
    private storage: Storage,
    private rest: RestService,
    private loadinCtrl: LoadingController,
    private message: MessagesService,
    private platform: Platform,
    private router: Router,
    private alertCtrl: AlertController
  ) {

  }

  async ngOnInit() {
    //this.mostrarAvatar();
    console.log("Empieza principal");
    this.obtenerDatosUsuario();
    this.platform.ready().then(() => {
      this.obtenerPlazasUsuario();
    });
  }

  ionViewDidEnter() {
    this.platform.ready().then(() => {
      this.obtenerPlazasUsuario();
    });
  }

  /**
   * Metodo para habilitar o deshabilitar las palomas de verificacion de descarga
   */
  async validaDescargas() {
    this.descargaAgua = await this.storage.get('DescargaAgua');
    this.descargaPredio = await this.storage.get('DescargaPredio');
  }

  /**
   * Metodo que obtiene las plazas y los ids guardadas en el storage por auth.service
   */
  async obtenerPlazasUsuario() {
    let plazasRest = this.rest.obtenerPlazas();
    this.plazas = (await plazasRest).plazas;
    this.idPlazas = (await plazasRest).idPlazas;
    this.id_plaza = await this.idPlazas[0];
    const servicios = await this.rest.mostrarServicios(this.id_plaza);
    // En este punto ya se tiene el primer id_plaza obtenido de la base
    this.mostrarServicios(servicios);
  }

  /**
   * Metodo que se ejcuta cuando cambian en selec option de la plazam este metodo tambien se ejecuta al inicio 
   * @param event 
   */
  async resultPlaza(event) {

    console.log("idPlaza: " + this.id_plaza);

    // si el idPlaza es diferente de 0 entonces verificar la descarga
    if (this.id_plaza != 0) {
      // verificar si el id_plaza escogida tiene un estatus true en el campo descargado de la tabla descargaServicios
      const estado = await this.verificarEstatusDescarga();
      this.agua = false;
      this.predio = false;
      this.antenas = false;
      this.pozos = false;
      this.asignarSectores(this.id_plaza);
    }
  }

  /**
   * Metodo que trae la informacion de la plaza para ver si ya fue descargada la informacion
   */
  async verificarEstatusDescarga() {
    // poner todos los estatus de descaga en false
    this.descargaAgua = false;
    this.descargaPredio = false;
    this.descargaAntenas = false;
    this.descargaPozos = false;
    const serviciosDescargados = await this.rest.verificaEstatusDescarga(this.id_plaza);
    console.log(serviciosDescargados);
    serviciosDescargados.forEach(servicio => {
      console.log(servicio);
      if (servicio.id_servicio == '1' && servicio.descargado == 'true') {
        console.log("Su servicio de agua si esta descargado");
        this.descargaAgua = true;
      } else if (servicio.id_servicio == '2' && servicio.descargado == 'true') {
        console.log("Su servicio de predio si esta descargado");
        this.descargaPredio = true;
      } else if (servicio.id_servicio == '3' && servicio.descargado == 'true') {
        console.log("Su servicio de antenas si esta descargado");
        this.descargaAntenas = true;
      } else if (servicio.id_servicio == '4' && servicio.descargado == 'true') {
        console.log("Su servicio de pozos si esta descargado");
        this.descargaPozos = true;
      }
    });
    return Promise.resolve('Success');
  }

  /**
   * Metodo que activa los servicios segun la plaza que se pasa por parametro
   * @param idPlaza 
   */
  async asignarSectores(idPlaza) {
    console.log("idplaza a " + idPlaza);

    if (idPlaza == 0) {
      this.selecciona = true;
    } else {
      this.selecciona = false;
    }

    const servicios = await this.rest.mostrarServicios(idPlaza);
    this.mostrarServicios(servicios);

  }


  mostrarServicios(servicios) {
    servicios.forEach(servicio => {
      if (servicio.id_servicio == 1) {
        this.agua = true;
      } else if (servicio.id_servicio == 2) {
        this.predio = true
      } else if (servicio.id_servicio == 3) {
        this.antenas = true;
      } else if (servicio.id_servicio == 4) {
        this.pozos = true;
      }
    });
  }

  // async mostrarAvatar() {
  //   this.imgAvatar += await this.storage.get('ImgAvatar');
  // }

  /**
   * Metodo que obtiene el nombre y el email del usuario desde el storage
   */
  async obtenerDatosUsuario() {
    console.log('Obteniendo los datos del usuario');
    this.nombre = await this.storage.get('Nombre');
    this.email = await this.storage.get('Email');
  }



  async confirmarDescarga(tipo) {

    if (tipo == 1) {
      console.log("Descargar agua en la plaza " + this.id_plaza);
      this.confirmaDescargaAgua(this.id_plaza)
    } else if (tipo == 2) {
      console.log("Descarga predio en la plaza " + this.id_plaza);
      this.confirmarDescargaPredio(this.id_plaza);
    } else if (tipo == 3) {
      console.log("Descarga antenas");
      console.log("Descarga predio en la plaza " + this.id_plaza);
      this.confirmarDescargaAntenas(this.id_plaza);
      // llamar al metodo confirme la descarga de pozos
    } else if (tipo == 4) {
      console.log("Descarga pozos");
      // llamar al metodo confirme la descarga de antenas
    }
  }

  async confirmaDescargaAgua(id_plaza) {
    const alert = await this.alertCtrl.create({
      subHeader: 'Descarga de cuentas de agua',
      message: 'Confirme para iniciar la descarga',
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary",
          handler: blah => {
            console.log("Confirm Cancel: blah");
          }
        },
        {
          text: "Confirmar",
          cssClass: "secondary",
          handler: () => {
            //  if(this.network.getNetworkType() == 'wifi'){
            this.descargarInformacionAgua(id_plaza);
          }
        }
      ]
    });
    await alert.present();
  }


  async confirmarDescargaPozos() {
    const alert = await this.alertCtrl.create({
      subHeader: 'Descarga de datos de Pozos',
      message: 'Confirme para iniciar descarga',
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary",
          handler: blah => {
            console.log("Confirm Cancel: blah");
          }
        },
        {
          text: "Confirmar",
          cssClass: "secondary",
          handler: () => {
            //  if(this.network.getNetworkType() == 'wifi'){
            this.descargarInfoPozos();
          }
        }
      ]
    });
    await alert.present();
  }

  async confirmarDescargaPredio(id_plaza) {
    const alert = await this.alertCtrl.create({
      subHeader: 'Descarga de cuentas de predio',
      message: 'Confirme para iniciar descarga',
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary",
          handler: blah => {
            console.log("Confirm Cancel: blah");
          }
        },
        {
          text: "Confirmar",
          cssClass: "secondary",
          handler: () => {
            //  if(this.network.getNetworkType() == 'wifi'){
            this.descargarInfoPredio(id_plaza);
          }
        }
      ]
    });
    await alert.present();
  }

  async confirmarDescargaAntenas(id_plaza) {
    const alert = await this.alertCtrl.create({
      subHeader: 'Descarga de cuentas de antenas',
      message: 'Confirme para iniciar descarga',
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary",
          handler: blah => {
            console.log("Confirm Cancel: blah");
          }
        },
        {
          text: "Confirmar",
          cssClass: "secondary",
          handler: () => {
            //  if(this.network.getNetworkType() == 'wifi'){
            this.descargarInfoAntenas(id_plaza);
          }
        }
      ]
    });
    await alert.present();
  }


  async descargarInformacionAgua(id_plaza) {

    this.progress = true;
    this.deleteInfoAgua();

    this.loading = await this.loadinCtrl.create({
      message: 'Descargando informaciòn...',
      spinner: 'dots'
    });

    await this.loading.present();
    const idaspuser = await this.storage.get("IdAspUser");

    try {
      this.data = await this.rest.obtenerDatosSqlAgua(idaspuser, id_plaza);
      this.total = this.data.length;

      if (this.total == 0) {
        this.message.showAlert("No tienes cuentas asignadas para descargar");
        this.loading.dismiss();
        return;
      }

      this.storage.set("total", this.total);

      await this.guardarDatosSQLAgua(this.data, id_plaza);

      // Aqui se guardaran las llaves en el storage para definir campos de validacion de modulos

      var dateDay = new Date().toISOString();
      let date: Date = new Date(dateDay);
      let ionicDate = new Date(
        Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds(),
        )
      );

      let fecha = ionicDate.toISOString();
      this.storage.set("FechaSync", fecha);
      this.loading.dismiss();
      await this.storage.set('DescargaAgua', true);

      this.descargaAgua = true;

      // se descargo agua en la plaza this.id_plaza, meter en la tabla descargaServicios
      this.actualizarEstatusDescarga(this.id_plaza, 1); // 1 es agua


      console.log(this.plazaServicioDescarga);
      this.message.showAlert("Se han descargado tus cuentas!!!!");
      //this.router.navigateByUrl('/home/tab2');
    } catch (eror) {
      this.message.showAlert("Error al intentar la descarga");
    }
  }


  async guardarDatosSQLAgua(data, id_plaza) {
    console.log("Guardando la informacion de agua");
    console.log(data);
    let cont = 0;
    for (let i = 0; i < data.length; i++) {
      await this.rest.guardarInfoSQLAgua(data[i], id_plaza);
      cont = cont + 1;
      this.progressTotal = cont / this.total;
    }
  }

  async actualizarEstatusDescarga(id_plaza, servicio) {
    await this.rest.guardarEstatusDescarga(id_plaza, servicio);
  }

  async descargarInfoPozos() {
    this.deleteInfoPozos();
    const idPlaza = await this.storage.get('IdPlaza');
    this.loading = await this.loadinCtrl.create({
      message: 'Descargando informaciòn de pozos...',
      spinner: 'bubbles'
    });

    await this.loading.present();

    try {
      this.dataPozos = await this.rest.obtenerDatosPozos(idPlaza);
      this.totalPozos = this.dataPozos.length;
      if (this.totalPozos == 0) {
        this.message.showAlert("No hay resultados, descargar datos de pozos");
        this.loading.dismiss();
        return;
      }

      await this.guardarDatosPozos(this.dataPozos);

      this.loading.dismiss();
      this.message.showAlert("Se han descargado tu informaciòn de pozos!!!!");

      this.router.navigateByUrl('/home/tab3');
    } catch (error) {

    }


  }

  async guardarDatosPozos(data) {
    for (let i = 0; i < data.length; i++) {
      await this.rest.guardarInfoSqlPozos(data[i]);
    }
  }


  async descargarInfoPredio(id_plaza) {
    this.progress = true;
    this.deleteInfoPredio();

    this.loading = await this.loadinCtrl.create({
      message: 'Descargando informaciòn...',
      spinner: 'dots'
    });

    await this.loading.present();

    const idaspuser = await this.storage.get("IdAspUser");

    try {
      this.data = await this.rest.obtenerDatosSqlPredio(idaspuser, id_plaza);
      this.total = this.data.length;

      if (this.total == 0) {
        this.message.showAlert("No tienes cuentas asignadas para sincronizar");
        this.loading.dismiss();
        return;
      }

      this.storage.set("total", this.total);

      await this.guardarDatosSQLPredio(this.data, id_plaza);

      // Aqui se guardaran las llaves en el storage para definir campos de validacion de modulos

      var dateDay = new Date().toISOString();
      let date: Date = new Date(dateDay);
      let ionicDate = new Date(
        Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds(),
        )
      );

      let fecha = ionicDate.toISOString();
      this.storage.set("FechaSync", fecha);
      this.loading.dismiss();
      await this.storage.set('DescargaPredio', true);

      this.descargaPredio = true;
      // se descargo agua en la plaza this.id_plaza, meter en la tabla descargaServicios
      this.actualizarEstatusDescarga(this.id_plaza, 2); // 2 es predio
      console.log(this.plazaServicioDescarga);
      this.message.showAlert("Se han descargado tus cuentas!!!!");

    } catch (eror) {
      this.message.showAlert("Error al intentar la descarga");
    }
  }

  async guardarDatosSQLPredio(data, id_plaza) {
    console.log("Guardando la informacion de predio");
    let cont = 0;
    for (let i = 0; i < data.length; i++) {
      await this.rest.guardarInfoSQLPredio(data[i], id_plaza);
      cont = cont + 1;
      this.progressTotal = cont / this.total;
    }
  }

  descargarInfoAntenas(id_plaza) {
    this.message.showAlert("No tienes cuentas asignadas para sincronizar");
  }

  async guardarDatosSQLAntenas(data) {

  }


  async deleteInfoAgua() {
    await this.rest.deleteTableAgua();
  }

  async deleteInfoPozos() {
    await this.rest.deleteTablePozos();
  }

  async deleteInfoPredio() {
    await this.rest.deleteTablePredio();
  }

  async deleteInfoAntenas() {

  }


  async goCuentasTab(tipo) {
    //this.router.navigateByUrl('/home/tab2');
    if( tipo == '1') {
      await this.storage.set('tipo', 'Agua');
    } else if(tipo == '2') {
      await this.storage.set('tipo', 'Predio');
    }
    console.log("Tipo " + tipo);
    

    const plaza_servicio = await this.rest.mostrarServicios(this.id_plaza);

    const plaza = plaza_servicio.filter( e => {
      return e.id_plaza == this.id_plaza
    })


    await this.storage.set('NombrePlazaActiva', plaza[0].plaza);
    await this.storage.set('IdPlazaActiva', plaza[0].id_plaza);

    this.router.navigate(['/listado-cuentas', tipo, this.id_plaza]);
  }

  goMapTab( tipo ) {
    if (tipo == '1') {
      this.router.navigate(['/google-maps', this.id_plaza]);
    } else if( tipo == '2') {
      this.router.navigate(['/mapa-predio', this.id_plaza]);
    }
  }


}
