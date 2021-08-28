import { Component, OnInit } from '@angular/core';
import { Storage } from "@ionic/storage";

@Component({
  selector: 'app-gestion-legal',
  templateUrl: './gestion-legal.page.html',
  styleUrls: ['./gestion-legal.page.scss'],
})
export class GestionLegalPage implements OnInit {

  imgs: any;
  personaAtiende: string = '';
  numeroContacto: string = '';
  idMotivoNoPago: number = 0;
  idTrabajoActual: number = 0;
  idTipoServicio: number = 0;
  numeroNiveles: number = 0;
  colorFachada: string = '';
  colorPuerta: string = '';
  idTipoPredio: number;
  entreCalle1: string = '';
  entreCalle2: string = '';
  observaciones: string = '';
  tipoServicioPadron: string = '';

  nombrePlaza:any;
  id_plaza: any;


  sliderOpts = {
    zoom: true,
    slidesPerView: 1.55,
    spaceBetween: 10,
    centeredSlides: true
  };

  constructor(
    private storage: Storage
  ) {
    this.imgs = [{ imagen: "assets/img/imgs.png" }];
  }

  ngOnInit() {
    this.getPlaza();
  }

  async getPlaza() {
    this.nombrePlaza = await this.storage.get('NombrePlazaActiva');
    this.id_plaza = await this.storage.get('IdPlazaActiva');
  }


  cambioMotivoNoPago( event ) {

  }

  deletePhoto(img) {

  }

  takePic( tipo ) {

  }

  verify() {
    
  }

  exit() {
    
  }


}
