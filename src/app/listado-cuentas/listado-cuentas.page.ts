import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute} from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { RestService } from '../services/rest.service';
import { MessagesService } from '../services/messages.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-listado-cuentas',
  templateUrl: './listado-cuentas.page.html',
  styleUrls: ['./listado-cuentas.page.scss'],
})
export class ListadoCuentasPage implements OnInit {

  loading:any;
  idTipo: any;
  findText: string = '';
  arrayCuentas = [
    {
      cuenta: 1020,
      propietario: 'Alejandro Aguilar Alderete',
      direccion: 'Calle 9 mz 3 lt 20 valle de los reyes',
      deuda: 20000,
      latitud: 19.366908,
      longitud: -98.975708
    },
    {
      cuenta: 1020,
      propietario: 'Carlos Martinez',
      direccion: 'Calle 9 mz 3 lt 20 colonia valle de los reyes',
      deuda: 20000,
      latitud: 19.35956,
      longitud: -98.9932
    },
    {
      cuenta: 1020,
      propietario: 'Oscar Alejandro Vazquez',
      direccion: 'Calle 9 mz 3 lt 20 valle de los reyes',
      deuda: 20000,
      latitud: 19.385208,
      longitud: -98.937244
    },
    {
      cuenta: 1020,
      propietario: 'Gamaliel Agama Agama',
      direccion: 'Calle 9 mz 3 lt 20 valle de los reyes',
      deuda: 20000,
      latitud: 19.385208,
      longitud: -98.937244
    },
    {
      cuenta: 1020,
      propietario: 'Rafita Valderrama',
      direccion: 'Calle 9 mz 3 lt 20 valle de los reyes',
      deuda: 20000,
      latitud: 19.385208,
      longitud: -98.937244
    }

  ];
  account:any[]; // Es lavariable que tendra la informacion de la tabla contribuyente
  total: number; // Es la variable que tendra el total
  gestionadas: number; // Es la ariable que tendra la el total de gestionadas;
  faltantes: number;


  constructor(
    private rest: RestService,
    private router: Router,
    private loadinCtrl: LoadingController,
    private geolocation: Geolocation,
    private iab:InAppBrowser,
    private message: MessagesService,
    private activeRoute: ActivatedRoute,
    private storage: Storage
  ) {}

    ngOnInit() {
      console.log("id: ",this.activeRoute.snapshot.paramMap.get('id'));
      this.idTipo = this.activeRoute.snapshot.paramMap.get('id');
      this.validarListadoCuentas( this.idTipo );
    }



    validarListadoCuentas( tipo ) {
      if(tipo == '1') {
        this.listadoCuentasAgua();
      } else if(tipo == '2') {
        this.listadoCuentasPredio();
      } else if(tipo == '3') {
        this.listadoCuentasAntenas()
      } else if(tipo == '4') {
        this.listadoCuentasPozos();
      }
    }

    async listadoCuentasAgua(){
      this.account = null;
      this.loading = await this.loadinCtrl.create({
        message: 'Cargando listado agua',
        spinner: 'lines-small'
      });
      await this.loading.present();
      await this.getInfoAgua();
      await this.getInfoCuentasAgua();
      this.loading.dismiss();
    }

    async listadoCuentasPredio() {
      this.account = null;
      this.loading = await this.loadinCtrl.create({
        message: 'Cargando listado predio',
        spinner: 'crescent'
      });
      await this.loading.present();
      await this.getInfoPredio();
      await this.getInfoCuentasPredio();
      this.loading.dismiss();
    }

    async listadoCuentasAntenas() {
      this.account = null;
      this.loading = await this.loadinCtrl.create({
        message: 'Cargando listado antenas',
        spinner: 'crescent'
      });
      await this.loading.present();
      await this.getInfoAntenas();
      await this.getInfoCuentasAntenas();
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

    async getInfoAgua() {
      this.total = await this.rest.getTotalAccountsAgua();
      console.log("Total agua: ", this.total);
      this.gestionadas = await this.rest.getGestionadasAgua();
      console.log("Gestionadas: ", this.gestionadas);
    }

    async getInfoPredio() {
      this.total = await this.rest.getTotalAccountsPredio();
      console.log("Total predio: ", this.total);
      this.gestionadas = await this.rest.getGestionadasPredio();
      console.log("Gestionadas: ", this.gestionadas);
    }

    async getInfoAntenas() {
      this.total = await this.rest.getTotalAccountsAntenas();
      console.log("Total predio: ", this.total);
    }

    async getInfoPozos() {
      this.total = await this.rest.getTotalAccountsPozos();
      console.log("Total predio: ", this.total);
    }

    async getInfoCuentasAgua() {
      this.account = null;
      this.account = await this.rest.cargarListadoCuentasAgua();
      console.log("Accounts: ", this.account);

      if(this.account.length == 0){
        this.message.showAlert("Descarga información de agua!!!!");
        this.router.navigateByUrl('/home');
      }

    }

    async getInfoCuentasPredio() {
      this.account = null;
      this.account = await this.rest.cargarListadoCuentasPredio();
      console.log("Accounts: ", this.account);

      if(this.account.length == 0) {
        this.message.showAlert("Descarga información de predio!!!!");
        this.router.navigateByUrl('/home');
      }
    }

    async getInfoCuentasAntenas() {
      this.account = null;
      this.account = await this.rest.cargarListadoCuentasAntenas();
      console.log("Accounts: ", this.account);

      if(this.account.length == 0) {
        this.message.showAlert("Descarga información de antenas!!!!");
        this.router.navigateByUrl('/home');
      }
    }

    async getInfoCuentasPozos() {
      this.account = null;
      this.account = await this.rest.cargarListadoCuentasPozos();
      console.log("Accounts: ", this.account);

      if(this.account.length == 0) {
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
  async openLink( cuenta ) {
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



  async gestionarCuenta( cuenta ) {

    // guardar en el storage la cuenta que se pasa por parametro
    await this.storage.set('account', cuenta)

    this.router.navigate(["gestion-page"]);

  }

  goPhotos(cuenta) {
    
  }

}
