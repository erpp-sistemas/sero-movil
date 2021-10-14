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

  }

  async ngOnInit() {
    //this.mostrarAvatar();
    console.log("Empieza principal");
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

    // tomamos el primer registro para ponerlo como defauult en el select
    if(this.plazasServicios.length > 0) {
      this.id_plaza = this.plazasServicios[0].id_plaza;
    }

    const servicios = await this.rest.mostrarServicios(this.id_plaza);
    
    // En este punto ya se tiene el primer id_plaza obtenido de la base
    this.mostrarServicios(servicios);
  }

  /**
   * Metodo que se ejcuta cuando cambian en selec option de la plazam este metodo tambien se ejecuta al inicio 
   * @param event 
   */
  async resultPlaza(event) {

    this.progressTotal = 0;

    // si el idPlaza es diferente de 0 entonces verificar la descarga
    if (this.id_plaza != 0) {
      this.asignarSectores(this.id_plaza);
    }
  }
 

  /**
   * Metodo que activa los servicios segun la plaza que se pasa por parametro viene del result
   * @param idPlaza 
   */
  async asignarSectores(idPlaza) {

    // validacion para mostrar la manita verde
    if (idPlaza == 0) {
      this.selecciona = true;
    } else {
      this.selecciona = false;
    }

    this.servicios = await this.rest.mostrarServicios(idPlaza);
    this.mostrarServicios(this.servicios);

  }

  // viene del obtenerPlazasUsuario
  async mostrarServicios(servicios) {
    this.servicios = await this.rest.mostrarServicios(this.id_plaza)
    
    this.servicios.forEach( servicio => {
      if(servicio.descargado > 0) {
        this.progressTotal = 100;
      }
    });

  }

  /**
   * Metodo que obtiene el nombre y el email del usuario desde el storage
   */
  async obtenerDatosUsuario() {
    console.log('Obteniendo los datos del usuario');
    this.nombre = await this.storage.get('Nombre');
    this.email = await this.storage.get('Email');
  }



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

      // se descargo agua en la plaza this.id_plaza, meter en la tabla descargaServicios
      
      this.actualizarEstatusDescarga(this.id_plaza, idServicioPlaza);

      this.message.showAlert("Se han descargado tus cuentas!!!!");
    } catch (eror) {
      this.message.showAlert("Error al intentar la descarga");
    }
  }


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

  async actualizarEstatusDescarga(id_plaza, servicio) {
    await this.rest.actualizaServicioEstatus(id_plaza, servicio);
    this.asignarSectores(this.id_plaza);
  }



  async deleteInfo(id_plaza, id_servicio_plaza) {
    await this.rest.deleteTable(id_plaza, id_servicio_plaza);
  }


  
  async goCuentasTab(idServicioPlaza) {
    //this.router.navigateByUrl('/home/tab2');
    // if (idServicioPlaza == '1') {
    //   await this.storage.set('tipo', 'Agua');
    //   await this.storage.set('IdServicio', 1);
    // } else if (idServicioPlaza == '2') {
    //   await this.storage.set('tipo', 'Predio');
    //   await this.storage.set('IdServicio', 1);
    // } else if(idServicioPlaza == '3') {
    //   await this.storage.set('tipo', 'Antenas');
    //   await this.storage.set('IdServicio', 3);
    // } else if(idServicioPlaza == '4') {
    //   await this.storage.set('tipo', 'Pozos');
    //   await this.storage.set('IdServicio', 4);
    // }

    const plaza_servicio = await this.rest.mostrarServicios(this.id_plaza);
    console.log(plaza_servicio);


    await this.storage.set('NombrePlazaActiva', plaza_servicio[0].plaza);
    await this.storage.set('IdPlazaActiva', plaza_servicio[0].id_plaza);
    await this.storage.set( 'IdServicioActivo', idServicioPlaza);

    console.log("IdServicioActivo " + idServicioPlaza);
    console.log("IdPlazaActiva " + plaza_servicio[0].id_plaza);
    console.log("NombrePlazaActiva " + plaza_servicio[0].plaza);


    
    this.router.navigate(['/listado-cuentas', idServicioPlaza, this.id_plaza]);
  }


  async goMapTab(idServicioPlaza) {
    const plaza_servicio = await this.rest.mostrarServicios(this.id_plaza);
    console.log(plaza_servicio);


    await this.storage.set('NombrePlazaActiva', plaza_servicio[0].plaza);
    await this.storage.set('IdPlazaActiva', plaza_servicio[0].id_plaza);
    await this.storage.set( 'IdServicioActivo', idServicioPlaza);

    console.log("IdServicioActivo " + idServicioPlaza);
    console.log("IdPlazaActiva " + plaza_servicio[0].id_plaza);
    console.log("NombrePlazaActiva " + plaza_servicio[0].plaza);


    
    this.router.navigate(['/mapa-google', idServicioPlaza, this.id_plaza]);
  }


}
