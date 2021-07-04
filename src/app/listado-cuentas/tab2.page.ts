import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras} from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { RestService } from '../services/rest.service';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {


  loading:any;
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
  gestionadas: number // Es la ariable que tendra la el total de gestionadas;


  constructor(
    private rest: RestService,
    private router: Router,
    private loadinCtrl: LoadingController,
    private geolocation: Geolocation,
    private iab:InAppBrowser,
    private message: MessagesService
  ) {}

    ngOnInit() {
      this.listadoCuentas();
    }


    async listadoCuentas(){
      this.account = null;
      this.loading = await this.loadinCtrl.create({
        message: 'Cargando listado',
        spinner: 'lines-small'
      });
      await this.loading.present();
      await this.getInfo();
      await this.getInfoCuentas();
      this.loading.dismiss();
    }

    async getInfo() {
      this.total = await this.rest.getTotalAccounts();
      console.log("total", this.total);
      this.gestionadas = await this.rest.getGestionadas();
    }

    async getInfoCuentas() {
      this.account = null;
      this.account = await this.rest.cargarListadoCuentas();
      console.log("Accounts: ", this.account);

      if(this.account.length == 0){
        this.message.showAlert("Descarga tu informaciòn!!!!");
        this.router.navigateByUrl('/home');
      }

    }


    find(event) {

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

    this.router.navigate(["gestion-page"]);

  }

  goPhotos(cuenta) {
    
  }



}
