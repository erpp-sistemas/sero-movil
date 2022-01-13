import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, MenuController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { MessagesService } from '../services/messages.service';
import { RestService } from '../services/rest.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  nombre: string = '';
  email: string = '';
  imgUser: string = '';
  progress: boolean = false;
  progressTotal: number = 0;
  loading: any;
  data: any;
  total: any;
  alert: any;


  id_plaza: number = 0; // select option de plaza
  selecciona: boolean = false; // manitra verde
  plazasServicios: any; // para almacenar esto (select distinct id_plaza, plaza from serviciosPlazaUser)
  servicios: any; // para almacenar los servicios (select * from serviciosPlazaUser where id_plaza = ?)



  constructor(
    private storage: Storage,
    private rest: RestService,
    private loadinCtrl: LoadingController,
    private message: MessagesService,
    private platform: Platform,
    private router: Router,
    private alertCtrl: AlertController
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log('Handler was called!');
    });
  }


  /**
   * Especificaciones de este componente
   * Es la pantalla principal de ser0 movil que inicia despues de loguearse
   * Desactiva el backbutton
   * Obtener los datos del usuario con el metodo obtenerDatosUsuario
   * Obtener los nombres de las plazas y los ids guardados por el auth.service 
   * Poner el primer registro de las plazas como default que sera el que se muestre cuando se renderize la pagina
   * Mostrar sus servicios
   * Validar descargas
   * Borrar informacion de sero_principal para poder descargar la nueva
   * Descarga de informacion
   * Actualizar estatus descarga
   * Navegar a listado de cuentas
   * Navegar a mapa
   */


  async ngOnInit() {
    this.obtenerDatosUsuario();
    this.platform.ready().then(async () => {
      await this.obtenerPlazasUsuario();
    });
  }

  ionViewDidEnter() {
    this.platform.ready().then(async () => {
      await this.obtenerPlazasUsuario();
    });
  }


  /**
   * Metodo que obtiene las plazas y los ids guardadas en el storage por auth.service
   */
  async obtenerPlazasUsuario() {

    this.plazasServicios = await this.rest.obtenerPlazasSQL();

    // tomamos el primer registro para ponerlo como plaza default en el select
    if (this.plazasServicios.length > 0) {
      this.id_plaza = this.plazasServicios[0].id_plaza;
    }

    this.asignarServicios();

  }

  /**
   * Metodo que asigna los servicios y manda a llamar a validar las descargas
   */
  async asignarServicios() {
    // En este punto ya se tiene el primer id_plaza obtenido de la base
    this.servicios = await this.rest.mostrarServicios(this.id_plaza);

    this.validaDescarga();
  }

  /**
 * Metodo que recorre los servicios y verifica su ya estan descargados para poner el progresTotal completo o en 0
 */
  validaDescarga() {

    this.servicios.forEach(servicio => {
      if (servicio.descargado > 0) {
        this.progressTotal = 100;
      }
    });

  }

  /**
   * Metodo que se ejecuta cuando cambian el select option de la plaza este metodo tambien se ejecuta al inicio 
   * @param event 
   */
  async resultPlaza(event) {

    this.progressTotal = 0;

    // si el idPlaza es diferente de 0 entonces verificar la descarga
    if (this.id_plaza != 0) {
      this.asignarServicios();
    }

  }

  /**
   * Metodo que actualiza el campo descargado de la tabla serviciosPlazaUser de la plaza y servicio pasado por parametro
   * @param id_plaza 
   * @param servicio 
   */
  async actualizarEstatusDescarga(id_plaza, servicio) {
    await this.rest.actualizaServicioEstatus(id_plaza, servicio);
    this.asignarServicios();
  }


  /**
   * Metodo que obtiene el nombre y el email del usuario desde el storage
   */
  async obtenerDatosUsuario() {
    console.log('Obteniendo los datos del usuario');
    this.nombre = await this.storage.get('Nombre');
    this.email = await this.storage.get('Email');
    //this.imgUser = await this.storage.get('Img'); aqui era del firebase pero lo vamos a traer de la base sql
    let img = await this.rest.obtenerFotoUserSQL();
    this.imgUser = img[0].foto;
  }


  /**
   * Metodo que pregunta si confirma la descarga
   * @param idServicioPlaza 
   * @param nombrePlaza 
   * @param nombreServicio 
   */
  async confirmarDescarga(idServicioPlaza, nombrePlaza, nombreServicio) {
    //console.log(idServicioPlaza, nombrePlaza, nombreServicio);
    const alert = await this.alertCtrl.create({
      header: nombrePlaza.toUpperCase(),
      subHeader: "Confirme para iniciar la descarga de " + nombreServicio,
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
            this.descargarInformacion(this.id_plaza, idServicioPlaza);
          }
        }
      ]
    });
    await alert.present();

  }

  /**
   * Metodo que realiza la descarga de la informacion de la plaza y del servicio seleccionado
   * @param id_plaza 
   * @param idServicioPlaza 
   * @returns 
   */
  async descargarInformacion(id_plaza, idServicioPlaza) {
    this.progress = true;
    // aqui solo abra un metodo para borrar la informacion deleteInfo
    this.deleteInfo(id_plaza, idServicioPlaza);

    this.loading = await this.loadinCtrl.create({
      message: 'Descargando informaciòn...',
      spinner: 'dots'
    });

    await this.loading.present();
    const idaspuser = await this.storage.get("IdAspUser");

    try {

      this.data = await this.rest.obtenerDatosSql(idaspuser, id_plaza, idServicioPlaza);
      this.total = this.data.length;

      if (this.total == 0) {
        this.message.showAlert("No tienes cuentas asignadas para descargar");
        this.loading.dismiss();
        return;
      }

      this.storage.set("total", this.total);

      // guardar en sero_principal
      await this.guardarDatosSQL(this.data, id_plaza, idServicioPlaza);

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

      this.actualizarEstatusDescarga(this.id_plaza, idServicioPlaza);

      this.message.showAlert("Se han descargado tus cuentas!!!!");
    } catch (eror) {
      this.message.showAlert("Error al intentar la descarga");
    }
  }

  /**
   * Metodo que guarda la informacion obtenida en la tabla interna sero_principal
   * @param data 
   * @param id_plaza 
   * @param idServicioPlaza 
   */
  async guardarDatosSQL(data, id_plaza, idServicioPlaza) {
    console.log("Guardando la informacion de " + idServicioPlaza);
    console.log(data);
    let cont = 0;
    for (let i = 0; i < data.length; i++) {
      await this.rest.guardarInfoSQL(data[i], id_plaza, idServicioPlaza);
      cont = cont + 1;
      this.progressTotal = cont / this.total;
    }
  }

  /**
   * Metodo que borra la informacion de la tabla sero_principal
   * @param id_plaza 
   * @param id_servicio_plaza 
   */
  async deleteInfo(id_plaza, id_servicio_plaza) {
    await this.rest.deleteTable(id_plaza, id_servicio_plaza);
  }


  /**
   * Metodo que envia al listado de cuentas
   * @param idServicioPlaza 
   */
  async goCuentasTab(idServicioPlaza) {

    console.log("IdServicioPlaza", idServicioPlaza);

    const plaza_servicio = await this.rest.mostrarServicios(this.id_plaza);
    console.log(plaza_servicio);


    await this.storage.set('NombrePlazaActiva', plaza_servicio[0].plaza);
    await this.storage.set('IdPlazaActiva', plaza_servicio[0].id_plaza);
    await this.storage.set('IdServicioActivo', idServicioPlaza);

    console.log("IdServicioActivo " + idServicioPlaza);
    console.log("IdPlazaActiva " + plaza_servicio[0].id_plaza);
    console.log("NombrePlazaActiva " + plaza_servicio[0].plaza);



    this.router.navigate(['/listado-cuentas', idServicioPlaza, this.id_plaza]);
  }

  /**
   * Metodo que manda al mapa
   * @param idServicioPlaza 
   */
  async goMapTab(idServicioPlaza) {
    const plaza_servicio = await this.rest.mostrarServicios(this.id_plaza);
    console.log(plaza_servicio);


    await this.storage.set('NombrePlazaActiva', plaza_servicio[0].plaza);
    await this.storage.set('IdPlazaActiva', plaza_servicio[0].id_plaza);
    await this.storage.set('IdServicioActivo', idServicioPlaza);

    console.log("IdServicioActivo " + idServicioPlaza);
    console.log("IdPlazaActiva " + plaza_servicio[0].id_plaza);
    console.log("NombrePlazaActiva " + plaza_servicio[0].plaza);



    //this.router.navigate(['/mapa-google', idServicioPlaza, this.id_plaza]);
    this.router.navigate(['mapa-prueba', idServicioPlaza, this.id_plaza]);
  }


}
