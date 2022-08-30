import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { RestService } from '../services/rest.service';
import { MessagesService } from '../services/messages.service';
import { Storage } from '@ionic/storage';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-listado-cuentas',
  templateUrl: './listado-cuentas.page.html',
  styleUrls: ['./listado-cuentas.page.scss'],
})
export class ListadoCuentasPage implements OnInit {

  loading: any;
  idServicioPlaza: any;
  id_plaza: any;
  findText: string = '';
  account: any[]; // Es lavariable que tendra la informacion de la tabla contribuyente
  total: number; // Es la variable que tendra el total
  gestionadas: number; // Es la ariable que tendra la el total de gestionadas;
  faltantes: number;
  busqueda: boolean = false;
  accountBusqueda: any[];


  constructor(
    private rest: RestService,
    private router: Router,
    private loadinCtrl: LoadingController,
    private geolocation: Geolocation,
    private iab: InAppBrowser,
    private message: MessagesService,
    private activeRoute: ActivatedRoute,
    private storage: Storage,
    private callNumber: CallNumber
  ) { }

  /**
   * Primero obtenemos las variables pasadas por el router que son el idservicio y el idplaza
   * ejecutamos el metodo listadoCuentas que este mismo ejecuta los metodos getInfo y getInfoCuentas 
  */


  ngOnInit() {
    this.idServicioPlaza = this.activeRoute.snapshot.paramMap.get('id');
    this.id_plaza = this.activeRoute.snapshot.paramMap.get('id_plaza');
    this.listadoCuentas(this.id_plaza, this.idServicioPlaza);
  }


  /**
   * Metodo que muestra el mensaje de cargando las cuentas asi como ejecuta los metodos getInfo y getInfoCuentas
   * @param id_plaza 
   * @param idServicioPlaza 
   */
  async listadoCuentas(id_plaza, idServicioPlaza) {
    this.account = null;
    this.accountBusqueda = null;
    this.loading = await this.loadinCtrl.create({
      message: 'Cargando listado ',
      spinner: 'lines-small'
    });
    await this.loading.present();
    await this.getInfo(id_plaza, idServicioPlaza);
    await this.getInfoCuentas(id_plaza, idServicioPlaza);
    this.loading.dismiss();
  }


  /**
   * Metodo que que trae del servicio el total de cuentas y el total de cuentas gestionadas por servicio y plaza (sero_principal)
   * @param id_plaza 
   * @param idServicioPlaza 
   */
  async getInfo(id_plaza, idServicioPlaza) {
    this.total = await this.rest.getTotalAccounts(id_plaza, idServicioPlaza);
    console.log("Total del servicio" + idServicioPlaza + " " + this.total);
    this.gestionadas = await this.rest.getGestionadas(id_plaza, idServicioPlaza);
    console.log("Gestionadas del servicio " + idServicioPlaza + " " + this.gestionadas);
  }

  /**
   * Metodo que trae del servicio las cuentas a cargar en el listado (sero_principal)
   * @param id_plaza 
   * @param idServicioPlaza 
   */
  async getInfoCuentas(id_plaza, idServicioPlaza) {
    this.account = null;
    this.account = await this.rest.cargarListadoCuentas(id_plaza, idServicioPlaza);

    this.accountBusqueda = null;
    this.accountBusqueda = await this.rest.cargarListadoCuentas(id_plaza, idServicioPlaza);


    if (this.account.length == 0) {
      this.message.showAlert("Tienes que descargar información para visualizar las cuentas!!!!");
      this.router.navigateByUrl('/home');
    }

  }

  /**
   * Metodo para buscar ls informacion
   * @param event 
   */
  find(event) {
    this.busqueda = true;
    this.findText = event.detail.value;
  }

  /**
   * Metodo que manda al componente streetview
   * @param item 
   */
  async goPanoramaView(item) {
    let position = {
      lat: parseFloat(item.latitud),
      lng: parseFloat(item.longitud)
    };
    console.log("Entra a ver la position");
    console.log(position);
    let navigationExtras: NavigationExtras = {
      state: {
        position: position
      }
    };

    this.router.navigate(["streetview"], navigationExtras);
  }



  /**
   * Metodo para trazar la ruta de la posicion del dispositivo a la cuenta
   * @param cuenta 
   */
  async openLink(cuenta) {
    this.loading = await this.loadinCtrl.create({
      message: 'Obteniedo ubicación'
    });

    await this.loading.present();
    const position = await this.geolocation.getCurrentPosition();
    this.loading.dismiss();
    let myLatitude = position.coords.latitude;
    let myLongitude = position.coords.longitude;
    let latitud = parseFloat(cuenta.latitud);
    let longitud = parseFloat(cuenta.longitud);

    let link = `https://www.google.com/maps/dir/'${myLatitude},${myLongitude}'/${latitud},${longitud}`;
    console.log(link);
    this.iab.create(link, "_system", { location: "yes", zoom: "yes" });
  }


  /**
   * Metodo que manda al componente de gestion-page para seleccionar el formulario a usar
   * @param cuenta 
   */
  async gestionarCuenta(item: any) {

    console.log(item);
    let { cuenta, id_proceso, proceso_gestion, url_aplicacion_movil, icono_proceso } = item;

    // guardar en el storage la cuenta y los doatos que serviran para la gestion
    await this.storage.set('account', cuenta)
    await this.storage.set('id_proceso', id_proceso);
    await this.storage.set('proceso_gestion', proceso_gestion);
    await this.storage.set('icono_proceso', icono_proceso);

    /**
    * Ya no se muestra la pantalla de gestion-page al ya traer el icono, el nombre, el id y la ruta del proceso
    */
    //this.router.navigate(["gestion-page"]);

    this.router.navigateByUrl(url_aplicacion_movil);

  }

  /**
   * Navegacion de los tabs
   * @param tipo 
   */
  navegar(tipo) {
    if (tipo == 1) {
      this.router.navigateByUrl('home/tab1');
    } else if (tipo == 2) {
      this.router.navigateByUrl('home/tab2');
    } else if (tipo == 3) {
      this.router.navigateByUrl('home/tab3');
    } else if (tipo == 4) {
      this.router.navigateByUrl('home/tab4');
    } else if (tipo == 5) {

      this.callNumber.callNumber('911', true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));

    }
  }


}
