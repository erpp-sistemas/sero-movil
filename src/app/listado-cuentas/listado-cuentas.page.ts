import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { LoadingController, MenuController } from '@ionic/angular';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { RestService } from '../services/rest.service';
import { MessagesService } from '../services/messages.service';
import { Storage } from '@ionic/storage';
import { AuthService } from '../services/auth.service';
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


  constructor(
    private rest: RestService,
    private router: Router,
    private loadinCtrl: LoadingController,
    private geolocation: Geolocation,
    private iab: InAppBrowser,
    private message: MessagesService,
    private activeRoute: ActivatedRoute,
    private storage: Storage,
    private auth: AuthService,
    private callNumber: CallNumber
  ) { }

  ngOnInit() {
    console.log("id: ", this.activeRoute.snapshot.paramMap.get('id'));
    console.log("plaza", this.activeRoute.snapshot.paramMap.get('id_plaza'));
    this.idServicioPlaza = this.activeRoute.snapshot.paramMap.get('id');
    this.id_plaza = this.activeRoute.snapshot.paramMap.get('id_plaza');
    this.listadoCuentas(this.id_plaza, this.idServicioPlaza);
  }



  async listadoCuentas(id_plaza, idServicioPlaza) {
    console.log("Cargando listado de cuentas del servicio " + idServicioPlaza + " de la plaza " + id_plaza);
    this.account = null;
    this.loading = await this.loadinCtrl.create({
      message: 'Cargando listado agua',
      spinner: 'lines-small'
    });
    await this.loading.present();
    await this.getInfo(id_plaza, idServicioPlaza );
    await this.getInfoCuentas(id_plaza, idServicioPlaza);
    this.loading.dismiss();
  }



  async getInfo(id_plaza, idServicioPlaza) {
    this.total = await this.rest.getTotalAccounts(id_plaza, idServicioPlaza);
    console.log("Total del servicio" + idServicioPlaza + " " + this.total);
    this.gestionadas = await this.rest.getGestionadas(id_plaza, idServicioPlaza);
    console.log("Gestionadas del servicio " + idServicioPlaza + " " + this.gestionadas);
  }
  

  async getInfoCuentas(id_plaza, idServicioPlaza) {
    this.account = null;
    this.account = await this.rest.cargarListadoCuentas(id_plaza, idServicioPlaza);
    console.log("Accounts: ", this.account);

    if (this.account.length == 0) {
      this.message.showAlert("Tienes que descargar información para visualizar las cuentas!!!!");
      this.router.navigateByUrl('/home');
    }

  }


  find(event) {
    this.findText = event.detail.value;
    console.log(this.findText);
  }


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



  async gestionarCuenta(cuenta) {

    // guardar en el storage la cuenta que se pasa por parametro
    await this.storage.set('account', cuenta)

    this.router.navigate(["gestion-page"]);

  }


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

      this.callNumber.callNumber('18001010101', true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));

    }
  }


}
