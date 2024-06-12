import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, MenuController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Proceso } from '../interfaces/Procesos';
import { MessagesService } from '../services/messages.service';
import { RestService } from '../services/rest.service';
import { DataGeneral, EncuestaGeneral } from '../interfaces';
import { DblocalService } from '../services/dblocal.service';

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
  dataProcess: Proceso[];


  id_plaza: number = 0; // select option de plaza
  selecciona: boolean = false; // manita verde
  plazasServicios: any; // para almacenar esto (select distinct id_plaza, plaza from serviciosPlazaUser)
  servicios: any; // para almacenar los servicios (select * from serviciosPlazaUser where id_plaza = ?)



  constructor(
    private storage: Storage,
    private rest: RestService,
    private loadinCtrl: LoadingController,
    private message: MessagesService,
    private platform: Platform,
    private router: Router,
    private alertCtrl: AlertController,
    private dbLocalService: DblocalService
  ) { }


  /**
   * Especificaciones de este componente
   * Es la pantalla principal de ser0 movil que inicia despues de loguearse
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
    this.plazasServicios = await this.dbLocalService.obtenerPlazasSQL();
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
    this.servicios = await this.dbLocalService.mostrarServicios(this.id_plaza);
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
  async resultPlaza(event: any) {
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
  async actualizarEstatusDescarga(id_plaza: number, servicio: number) {
    await this.dbLocalService.actualizaServicioEstatus(id_plaza, servicio);
    this.asignarServicios();
  }


  /**
   * Metodo que obtiene el nombre y el email del usuario desde el storage
   */
  async obtenerDatosUsuario() {
    this.nombre = await this.storage.get('Nombre');
    this.email = await this.storage.get('Email');
    this.imgUser = await this.storage.get('Foto');
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
  async descargarInformacion(id_plaza: number, idServicioPlaza: number) {

    this.progress = true;

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

      //peticion al sql por los procesos de gestion de la plaza
      this.getProcessByIdPlaza(this.id_plaza);


      this.message.showAlert("Se han descargado tus cuentas!!!!");
    } catch (error) {
      console.log(error);
      await this.loading.dismiss();
      if (error.name === 'HttpErrorResponse') {
        this.message.showAlert("Error al descargar las cuentas, verificar conexión a internet");
      }
    }
  }

  /**
   * Metodo que guarda la informacion obtenida en la tabla interna sero_principal
   * @param data 
   * @param id_plaza 
   * @param idServicioPlaza 
   */
  async guardarDatosSQL(data: DataGeneral[], id_plaza: number, id_servicio_plaza: number) {
    let cont = 0;
    for (let i = 0; i < data.length; i++) {
      await this.dbLocalService.guardarInfoSQL(data[i], id_plaza, id_servicio_plaza);
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
    await this.dbLocalService.deleteTable(id_plaza, id_servicio_plaza);
  }


  async getProcessByIdPlaza(id_plaza: number) {
    this.dataProcess = await this.rest.obtenerProcesosByIdPlaza(id_plaza);
    // si obtenemos dataProcess lo guardamos en su tabla interna
    if (this.dataProcess.length === 0) {
      this.message.showToast("Esta plaza no tiene procesos de gestión, verificar en ser0 web!!!!");
      return;
    }

    // validamos si tenemos descargados procesos de la plaza asignada
    const validacion = await this.dbLocalService.processPlazaExists(id_plaza);
    if (validacion) {
      await this.dbLocalService.deleteProcessByIdPlaza(id_plaza);
    }

    this.dataProcess.forEach(async process => {
      let statusProcess = await this.dbLocalService.insertProcessTable(process);
      if (statusProcess) {
        this.message.showToast(`${process.nombre_proceso} listo...`);
      } else {
        this.message.showToast(`${process.nombre_proceso} no se guardo`);
      }
    })
  }

  /**
   * Metodo que envia al listado de cuentas
   * @param idServicioPlaza 
   */
  async goCuentasTab(idServicioPlaza) {

    const plaza_servicio = await this.dbLocalService.mostrarServicios(this.id_plaza);

    await this.storage.set('NombrePlazaActiva', plaza_servicio[0].plaza);
    await this.storage.set('IdPlazaActiva', plaza_servicio[0].id_plaza);
    await this.storage.set('IdServicioActivo', idServicioPlaza);

    this.router.navigate(['/listado-cuentas', idServicioPlaza, this.id_plaza]);
  }

  /**
   * Metodo que manda al mapa
   * @param idServicioPlaza 
   */
  async goMapTab(idServicioPlaza) {
    const plaza_servicio = await this.dbLocalService.mostrarServicios(this.id_plaza);

    await this.storage.set('NombrePlazaActiva', plaza_servicio[0].plaza);
    await this.storage.set('IdPlazaActiva', plaza_servicio[0].id_plaza);
    await this.storage.set('IdServicioActivo', idServicioPlaza);

    //this.router.navigate(['/mapa-google', idServicioPlaza, this.id_plaza]);
    this.router.navigate(['mapa-prueba', idServicioPlaza, this.id_plaza]);
  }



}
