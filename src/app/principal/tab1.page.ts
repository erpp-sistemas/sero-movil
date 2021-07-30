import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
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
  plazas:any = [];
  idPlazas:any = [];
  id_plaza: number = 0; // select option de plaza
  plaza: number = 0;

  plazaServicioDescarga = [];

  constructor(
    private storage: Storage,
    private menuCtrl: MenuController,
    private auth: AuthService,
    private rest: RestService,
    private loadinCtrl: LoadingController,
    private message: MessagesService,
    private router: Router,
    private alertCtrl: AlertController,
  ) { }

  async ngOnInit() {
    //this.mostrarAvatar();
    this.obtenerDatosUsuario();
    this.validaDescargas();
  }

  ionViewDidEnter() {
    this.obtenerPlazasUsuario();
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
    this.plazas = [];
    this.idPlazas = [];
    let numeroPlazas = await this.storage.get('NumeroPlazas');
    console.log("Numero de plazas: " , numeroPlazas);
    for(let i = 0; i < numeroPlazas; i++) {
      let temp = await this.storage.get(`nombre${i+1}`);
      //console.log(`nombre${i+1}`)
      this.plazas.push(temp);
      //console.log("Temp: ", temp);
      temp = null;
    }

    console.log(this.plazas);

    for(let i = 0; i < numeroPlazas; i++) {
      let temp2 = await this.storage.get(`idPlaza${i+1}`);
      //console.log(`idPlaza${i+1}`)
      this.idPlazas.push(temp2);
      //console.log("Temp2: ", temp2);
      temp2 = null;
    }
    // le ponemos al id_plaza el primer valor del arreglo id_plazas que sera el que aparecera por defecto
    this.id_plaza = this.idPlazas[0];
    console.log(this.idPlazas);

  }

  /**
   * Metodo que se ejcuta cuando cambian en selec option de la plaza
   * @param event 
   */
  async resultPlaza( event ) {
    console.log("idPlaza: " + this.id_plaza);

    // verificar si el id_plaza escogida tiene un estatus true en el campo descargado de la tabla descargaServicios
    this.verificarEstatusDescarga();

    this.agua = false;
    this.predio = false;
    this.antenas = false;
    this.pozos = false;
    this.plaza = event.detail.value
    // this.asignarSectores(this.plaza);
    this.asignarSectores(this.id_plaza);
    //console.log(event.detail.value);
  }

  async verificarEstatusDescarga() {
    // poner todos los estatus de descaga en false
    this.descargaAgua = false;
    this.descargaPredio = false;
    this.descargaAntenas = false;
    this.descargaPozos = false;
    const serviciosDescargados = await this.rest.verificaEstatusDescarga(this.id_plaza);
    console.log(serviciosDescargados);
    serviciosDescargados.forEach( servicio => {
      console.log(servicio);
      if(servicio.id_servicio == '1' && servicio.descargado == 'true') {
        console.log("Su servicio de agua si esta descargado");
        this.descargaAgua = true;
      } else if ( servicio.id_servicio == '2' && servicio.descargado == 'true') {
        console.log("Su servicio de predio si esta descargado");
        this.descargaPredio = true;
      }
    });
  }

  /**
   * Metodo que activa los servicios segun la plaza que se pasa por parametro
   * @param idPlaza 
   */
  async asignarSectores( idPlaza ) {

    const servicios = await this.rest.mostrarServicios(idPlaza);
    //console.log("Servicios");
    //console.log(servicios);
    servicios.forEach( servicio => {
      if(servicio.id_servicio == 1) {
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
    this.nombre = await this.storage.get('Nombre');
    this.email = await this.storage.get('Email');
  }



  async confirmarDescarga(tipo) {

    if (tipo == 1) {
      console.log("Descargar agua en la plaza " + this.id_plaza);
      this.confirmaDescargaAgua(this.id_plaza)
    } else if (tipo == 2) {
      console.log("Descarga predio en la plaza " + this.plaza);
      this.confirmarDescargaPredio();
    } else if (tipo == 3) {
      console.log("Descarga pozos");
      // llamar al metodo confirme la descarga de pozos
    } else if (tipo == 4) {
      console.log("Descarga antenas");
      // llamar al metodo confirme la descarga de antenas
    }
  }

  async confirmaDescargaAgua( id_plaza) {
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

  async confirmarDescargaPredio() {
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
            this.descargarInfoPredio();
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
        this.message.showAlert("No tienes cuentas para sincronizar");
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
    let cont = 0;
    for (let i = 0; i < data.length; i++) {
      await this.rest.guardarInfoSQLAgua(data[i], id_plaza);
      cont = cont + 1;
      this.progressTotal = cont / this.total;
      //console.log("Guardado: " + cont);
    }
   // console.log("Se ha terminado de guardar la informacion traida del sql");
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


  async descargarInfoPredio() {
    this.progress = true;
    this.deleteInfoPredio();

    this.loading = await this.loadinCtrl.create({
      message: 'Descargando informaciòn...',
      spinner: 'dots'
    });

    await this.loading.present();
    // const idaspuser = await this.storage.get("IdAspUser");
    // const idplaza = await this.storage.get("IdPlaza");

    // borrar esto, solo es de pruebas
    const idplaza = '9';
    const idaspuser = '137a6ec4-3d9a-4271-aa31-268c1d2898e4';

    try {
      this.data = await this.rest.obtenerDatosSqlPredio(idaspuser, idplaza);
      this.total = this.data.length;

      if (this.total == 0) {
        this.message.showAlert("No tienes cuentas para sincronizar");
        this.loading.dismiss();
        return;
      }

      this.storage.set("total", this.total);

      await this.guardarDatosSQLPredio(this.data);

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
      this.message.showAlert("Se han descargado tus cuentas!!!!");
      //this.router.navigateByUrl('/home/tab2');
    } catch (eror) {
      this.message.showAlert("Error al intentar la descarga");
    }
  }

  async guardarDatosSQLPredio(data) {
    console.log("Guardando la informacion de predio");
    let cont = 0;
    for (let i = 0; i < data.length; i++) {
      await this.rest.guardarInfoSQLPredio(data[i]);
      cont = cont + 1;
      this.progressTotal = cont / this.total;
    }
  }

  descargaInfoAntenas() {

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

  toggleMenu() {
    this.menuCtrl.toggle();
  }


  exit() {
    this.menuCtrl.close();
    this.auth.logout();
  }


  checador() {

  }

  listadoCuentas() {

  }


  manualWeb() {

  }

  gestionesRealizadas() {
    console.log("Ir a a gestiones realizadas");
    this.router.navigateByUrl('/sincronizar-gestiones')
  }

  goCuentasTab() {
    this.router.navigateByUrl('/home/tab2');
  }

  goMapTab() {
    this.router.navigateByUrl('/home/tab3');
  }


}
