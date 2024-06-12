import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DblocalService } from '../services/dblocal.service';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page implements OnInit {

  idPlazas = [];
  plazas = [];
  id_plaza: number;

  selecciona: boolean = false; // manitra verde
  plazasServicios: any; // para almacenar esto (select distinct id_plaza, plaza from serviciosPlazaUser)
  servicios: any; // para almacenar los servicios (select * from serviciosPlazaUser where id_plaza = ?)

  constructor(
    private router: Router,
    private storage: Storage,
    private dblocal: DblocalService,
    private platform: Platform,
    private dbLocalService: DblocalService
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
    this.plazasServicios = await this.dblocal.obtenerPlazasSQL();
    this.id_plaza = this.plazasServicios[0].id_plaza;
    this.mostrarServicios();
  }

  /**
   * Metodo que se ejcuta cuando cambian en selec option de la plazam este metodo tambien se ejecuta al inicio 
   * @param event 
   */
   async resultPlaza(event: any) {
    if (this.id_plaza != 0) {
      this.asignarSectores(this.id_plaza);
    }
  }
 

  /**
   * Metodo que activa los servicios segun la plaza que se pasa por parametro viene del result
   * @param idPlaza 
   */
  async asignarSectores(id_plaza: number) {
    if (id_plaza === 0) {
      this.selecciona = true;
    } else {
      this.selecciona = false;
    }
    this.mostrarServicios();
  }

  // viene del obtenerPlazasUsuario
  async mostrarServicios() {
    this.servicios = await this.dbLocalService.mostrarServicios(this.id_plaza)
  }


  async irListado(id_servicio_plaza: number) {
    const plaza_servicio = await this.dbLocalService.mostrarServicios(this.id_plaza);
    
    await this.storage.set('NombrePlazaActiva', plaza_servicio[0].plaza);
    await this.storage.set('IdPlazaActiva', plaza_servicio[0].id_plaza);
    await this.storage.set( 'IdServicioActivo', id_servicio_plaza);
    
    this.router.navigate(['/listado-cuentas', id_servicio_plaza, this.id_plaza]);
  }




}
