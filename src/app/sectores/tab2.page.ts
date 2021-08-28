import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
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

  constructor(
    private router: Router,
    private storage: Storage,
    private rest: RestService,
    private auth: AuthService
  ) { }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.obtenerPlazasUsuario();
  }

  async obtenerPlazasUsuario() {
    let plazasRest = this.rest.obtenerPlazas();
    this.plazas = (await plazasRest).plazas;
    this.idPlazas = (await plazasRest).idPlazas;
    this.id_plaza = this.idPlazas[0];
  }

  async resultPlaza(event) {
    console.log("idPlaza: " + this.id_plaza);

    // verificar si el id_plaza escogida tiene un estatus true en el campo descargado de la tabla descargaServicios
    this.verificarEstatusDescarga();

    this.agua = false;
    this.predio = false;
    this.antenas = false;
    this.pozos = false;
    // this.asignarSectores(this.plaza);
    this.asignarSectores(this.id_plaza);
    //console.log(event.detail.value);
  }

  async verificarEstatusDescarga() {
    // poner todos los estatus de descaga en false
    this.descargaAgua = false;
    this.descargaPredio = false;
    this.descargaAntenas = false;
    this.descargaPozos = false;
    const serviciosDescargados = await this.rest.verificaEstatusDescarga(this.id_plaza);
    console.log(serviciosDescargados);
    serviciosDescargados.forEach(servicio => {
      console.log(servicio);
      if (servicio.id_servicio == '1' && servicio.descargado == 'true') {
        console.log("Su servicio de agua si esta descargado");
        this.descargaAgua = true;
      } else if (servicio.id_servicio == '2' && servicio.descargado == 'true') {
        console.log("Su servicio de predio si esta descargado");
        this.descargaPredio = true;
      }
    });
  }


  async asignarSectores(idPlaza) {
    console.log("idplaza a " + idPlaza);
    const servicios = await this.rest.mostrarServicios(idPlaza);
    //console.log("Servicios");
    //console.log(servicios);
    servicios.forEach(servicio => {
      if (servicio.id_servicio == 1) {
        this.agua = true;
      } else if (servicio.id_servicio == 2) {
        this.predio = true
      } else if (servicio.id_servicio == 3) {
        this.antenas = true;
      } else if (servicio.id_servicio == 4) {
        this.pozos = true;
      }
    });

  }



  async irAgua() {
    console.log("agua");
    await this.storage.set('tipo', 'Agua');
    const plaza_servicio = await this.rest.mostrarServicios(this.id_plaza);

    const plaza = plaza_servicio.filter(e => {
      return e.id_plaza == this.id_plaza
    })

    await this.storage.set('NombrePlazaActiva', plaza[0].plaza);
    await this.storage.set('IdPlazaActiva', plaza[0].id_plaza);

    this.router.navigate(["/listado-cuentas", 1, this.id_plaza]);
  }

  async irPredio() {
    console.log("predio");
    await this.storage.set('tipo', 'Predio');
    const plaza_servicio = await this.rest.mostrarServicios(this.id_plaza);

    const plaza = plaza_servicio.filter( e => {
      return e.id_plaza == this.id_plaza
    })

    await this.storage.set('NombrePlazaActiva', plaza[0].plaza);
    await this.storage.set('IdPlazaActiva', plaza[0].id_plaza);

    this.router.navigate(["/listado-cuentas", 2, this.id_plaza]);
  }

  async irAntenas() {
    console.log("antenas");
    await this.storage.set('tipo', 'Antenas');
    const plaza_servicio = await this.rest.mostrarServicios(this.id_plaza);
    const plaza = plaza_servicio.filter( e => {
      return e.id_plaza == this.id_plaza
    })
    await this.storage.set('NombrePlazaActiva', plaza[0].plaza);
    await this.storage.set('IdPlazaActiva', plaza[0].id_plaza);
    this.router.navigate(["/listado-cuentas", 3, this.id_plaza]);
  }

  async irPozos() {
    console.log("pozos");
    this.router.navigate(["/listado-cuentas", 4]);
  }



}
