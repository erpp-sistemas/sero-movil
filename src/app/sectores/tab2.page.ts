import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthService } from '../services/auth.service';
import { RestService } from '../services/rest.service';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page implements OnInit {

  agua: boolean;
  predio: boolean;
  antenas: boolean;
  pozos: boolean;

  idPlazas = [];
  plazas = [];
  id_plaza: number;

  descargaAgua: boolean = false;
  descargaPredio: boolean = false;
  descargaAntenas: boolean = false;
  descargaPozos: boolean = false;

  selecciona: boolean = false; // manitra verde
  plazasServicios: any; // para almacenar esto (select distinct id_plaza, plaza from serviciosPlazaUser)
  servicios: any; // para almacenar los servicios (select * from serviciosPlazaUser where id_plaza = ?)

  constructor(
    private router: Router,
    private storage: Storage,
    private rest: RestService,
    private auth: AuthService,
    private platform: Platform
  ) { }

  ngOnInit() {  
    this.platform.ready().then(() => {
      this.obtenerPlazasUsuario();
    });
  }

  ionViewDidEnter() {
    this.obtenerPlazasUsuario();
  }

  /**
   * Metodo que obtiene las plazas y los ids guardadas en el storage por auth.service
   */
   async obtenerPlazasUsuario() {

    this.plazasServicios = await this.rest.obtenerPlazasSQL();
    

    // tomamos el primer registro para ponerlo como defauult en el select
    this.id_plaza = this.plazasServicios[0].id_plaza;

    const servicios = await this.rest.mostrarServicios(this.id_plaza);
    
    // En este punto ya se tiene el primer id_plaza obtenido de la base
    this.mostrarServicios(servicios);
  }

  /**
   * Metodo que se ejcuta cuando cambian en selec option de la plazam este metodo tambien se ejecuta al inicio 
   * @param event 
   */
   async resultPlaza(event) {
    console.log(event.detail.value);
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

  }


  async irListado(idServicioPlaza) {
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




}
