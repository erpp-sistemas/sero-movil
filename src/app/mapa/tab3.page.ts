import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GoogleMapsPage } from '../google-maps/google-maps.page';
import { Router } from '@angular/router';
import { RestService } from '../services/rest.service';



@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  modal: any;
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
    private modalCtrl: ModalController,
    private router: Router,
    private rest: RestService
  ) { }

  async ngOnInit() {

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
    this.router.navigate(["/google-maps", this.id_plaza]);
  }


  async googleMaps() {
    this.router.navigateByUrl("/google-maps");
  }

  async irPozos() {
    this.router.navigateByUrl("/pozo-conagua");
  }

  async cartografia() {
    //this.router.navigateByUrl("/cartografia-s");
  }

  async irPredio() {
    this.router.navigate(["/mapa-predio", this.id_plaza]);
  }

  async irAntenas() {
    
  }




}
