import { Component, OnInit } from '@angular/core';

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




  sliderOpts = {
    zoom: true,
    slidesPerView: 1.55,
    spaceBetween: 10,
    centeredSlides: true
  };

  constructor() {
    this.imgs = [{ imagen: "assets/img/imgs.png" }];
  }

  ngOnInit() {
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
