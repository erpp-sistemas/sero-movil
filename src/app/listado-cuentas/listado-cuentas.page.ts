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
  idTipo: any;
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
    this.idTipo = this.activeRoute.snapshot.paramMap.get('id');
    this.id_plaza = this.activeRoute.snapshot.paramMap.get('id_plaza');
    this.validarListadoCuentas(this.idTipo);
  }



  validarListadoCuentas(tipo) {
    if (tipo == '1') {
      this.listadoCuentasAgua(this.id_plaza);
    } else if (tipo == '2') {
      this.listadoCuentasPredio(this.id_plaza);
    } else if (tipo == '3') {
      this.listadoCuentasAntenas(this.id_plaza)
    } else if (tipo == '4') {
      this.listadoCuentasPozos();
    }
  }

  async listadoCuentasAgua(id_plaza) {
    console.log("Cargando listado de cuentas de agua de la plaza " + id_plaza);
    this.account = null;
    this.loading = await this.loadinCtrl.create({
      message: 'Cargando listado agua',
      spinner: 'lines-small'
    });
    await this.loading.present();
    await this.getInfoAgua(id_plaza);
    await this.getInfoCuentasAgua(id_plaza);
    this.loading.dismiss();
  }

  async listadoCuentasPredio(id_plaza) {
    console.log("Cargando listado de cuentas de predio de la plaza " + id_plaza);
    this.account = null;
    this.loading = await this.loadinCtrl.create({
      message: 'Cargando listado predio',
      spinner: 'crescent'
    });
    await this.loading.present();
    await this.getInfoPredio(id_plaza);
    await this.getInfoCuentasPredio(id_plaza);
    this.loading.dismiss();
  }

  async listadoCuentasAntenas(id_plaza) {
    this.account = null;
    this.loading = await this.loadinCtrl.create({
      message: 'Cargando listado antenas',
      spinner: 'crescent'
    });
    await this.loading.present();
    await this.getInfoAntenas(id_plaza);
    await this.getInfoCuentasAntenas(id_plaza);
    this.loading.dismiss();
  }

  async listadoCuentasPozos() {
    this.account = null;
    this.loading = await this.loadinCtrl.create({
      message: 'Cargando listado pozos',
      spinner: 'crescent'
    });
    await this.loading.present();
    await this.getInfoPozos();
    await this.getInfoCuentasPozos();
    this.loading.dismiss();
  }

  async getInfoAgua(id_plaza) {
    this.total = await this.rest.getTotalAccountsAgua(id_plaza);
    console.log("Total agua: ", this.total);
    this.gestionadas = await this.rest.getGestionadasAgua(id_plaza);
    console.log("Gestionadas: ", this.gestionadas);
  }

  async getInfoPredio(id_plaza) {
    this.total = await this.rest.getTotalAccountsPredio(id_plaza);
    console.log("Total predio: ", this.total);
    this.gestionadas = await this.rest.getGestionadasPredio(id_plaza);
    console.log("Gestionadas: ", this.gestionadas);
  }

  async getInfoAntenas(id_plaza) {
    this.total = await this.rest.getTotalAccountsAntenas(id_plaza);
    console.log("Total antenas: ", this.total);
    this.gestionadas = await this.rest.getGestionadasAntenas(id_plaza);
    console.log("Gestionadas: ", this.gestionadas);
  }

  async getInfoPozos() {
    this.total = await this.rest.getTotalAccountsPozos();
    console.log("Total predio: ", this.total);
  }

  async getInfoCuentasAgua(id_plaza) {
    this.account = null;
    this.account = await this.rest.cargarListadoCuentasAgua(id_plaza);
    console.log("Accounts: ", this.account);

    if (this.account.length == 0) {
      this.message.showAlert("Tienes que descargar información para visualizar las cuentas!!!!");
      this.router.navigateByUrl('/home');
    }

  }

  async getInfoCuentasPredio(id_plaza) {
    this.account = null;
    this.account = await this.rest.cargarListadoCuentasPredio(id_plaza);
    console.log("Accounts: ", this.account);

    if (this.account.length == 0) {
      this.message.showAlert("Tienes que descargar información para visualizar las cuentas!!!!");
      this.router.navigateByUrl('/home');
    }
  }

  async getInfoCuentasAntenas(id_plaza) {
    console.log("mostrando las cuentas de antenas");
    this.account = null;
    this.account = await this.rest.cargarListadoCuentasAntenas(id_plaza);
    console.log("Accounts: ", this.account);

    if (this.account.length == 0) {
      this.message.showAlert("Tienes que descargar información para visualizar las cuentas!!!!");
      this.router.navigateByUrl('/home');
    }
  }

  async getInfoCuentasPozos() {
    this.account = null;
    this.account = await this.rest.cargarListadoCuentasPozos();
    console.log("Accounts: ", this.account);

    if (this.account.length == 0) {
      this.message.showAlert("Descarga información de pozos!!!!");
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

  goPhotos(cuenta) {

  }

  navegar(tipo) {
    if (tipo == 1) {
      this.router.navigateByUrl('home/tab1');
    } else if (tipo == 2) {
      this.router.navigateByUrl('home/tab2');
    } else if (tipo == 3) {
      this.router.navigateByUrl('home/tab3');
    } else if (tipo == 4) {
      this.router.navigateByUrl('/servicios-publicos');
    } else if (tipo == 5) {

      this.callNumber.callNumber('18001010101', true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));

    }
  }


}
