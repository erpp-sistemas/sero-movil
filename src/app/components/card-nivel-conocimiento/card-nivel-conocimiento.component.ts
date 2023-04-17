import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataNivelConocmiento } from '../../interfaces/NivelConocimiento'

@Component({
  selector: 'app-card-nivel-conocimiento',
  templateUrl: './card-nivel-conocimiento.component.html',
  styleUrls: ['./card-nivel-conocimiento.component.scss'],
})
export class CardNivelConocimientoComponent implements OnInit {

  //@Input() activaCard: boolean;
  @Output() sendData = new EventEmitter<DataNivelConocmiento>();

  activaCard: boolean = true;

  conocePresidenteMunicipal: boolean; // 1.1
  conocePresidenteMunicipalS: string = ''; // para que persista el valor si es que el usuario oculta el card y lo vuelve a mostrar
  nombrePresidenteMunicipal: string = ''; // 1.2
  resultadoNombrePresidenteMunicipal: string = '';
  idPartidoPoliticoPresidenteMunicipal: string = '' // 1.3

  conoceGobernadorEstado: boolean; // 1.4
  conoceGobernadorEstadoS: string = ''; // para que persista el valor si es que el usuario oculta el card y lo vuelve a mostrar
  nombreGobernadorEstado: string = ''; //1.5
  resultadoNombreGobernadorEstado: string = '';
  idPartidoPoliticoGobernadorEstado: string = '' // 1.6

  conocePresidenteMexico: boolean; // 1.7
  conocePresidenteMexicoS: string = ''; // para que persista el valor si es que el usuario oculta el card y lo vuelve a mostrar
  nombrePresidenteMexico: string = '' // 1.8
  resultadoNombrePresidenteMexico: string = '';
  idPartidoPoliticoPresidenteMexico: string = '' // 1.9


  idEleccionesEstado: string = ''; // 1.10

  nombreCandidatoPanEstadoMexico: string = ''; // 1.11
  resultadoNombreCandidatoPanEstadoMexico: string = '';


  nombreCandidatoPriEstadoMexico: string = ''; // 1.12
  resultadoNombreCandidatoPriEstadoMexico: string = '';

  nombreCandidatoPrdEstadoMexico: string = ''; // 1.13
  resultadoNombreCandidatoPrdEstadoMexico: string = '';

  nombreCandidatoMorenaEstadoMexico: string = ''; // 1.14
  resultadoNombreCandidatoMorenaEstadoMexico: string = '';


  constructor() { }

  ngOnInit() { }


  resultConocePresidenteMunicipal(event: any) {
    let resultado = event.detail.value;
    this.conocePresidenteMunicipal = resultado === 'si' ? true : false;
    if (this.conocePresidenteMunicipal === false) this.nombrePresidenteMunicipal = ''
  }

  resultConoceGobernadorEstado(event: any) {
    let resultado = event.detail.value;
    this.conoceGobernadorEstado = resultado === 'si' ? true : false;
    if (this.conoceGobernadorEstado === false) this.nombreGobernadorEstado = ''
  }

  resultConocePresidenteMexico(event: any) {
    let resultado = event.detail.value;
    this.conocePresidenteMexico = resultado === 'si' ? true : false;
    if (this.conocePresidenteMexico === false) this.nombrePresidenteMexico = ''
  }

  resultEstadoElecciones(event: any) {
    this.idEleccionesEstado = event.detail.value;
  }

  completeCard() {
    this.activaCard = false;
    this.sendData.emit(
      {
        conocePresidenteMunicipal: this.conocePresidenteMunicipalS,
        nombrePresidenteMunicipal: this.nombrePresidenteMunicipal,
        resultadoNombrePresidenteMunicipal: this.resultadoNombrePresidenteMunicipal,
        idPartidoPoliticoPresidenteMunicipal: this.idPartidoPoliticoPresidenteMunicipal,
        conoceGobernadorEstado: this.conoceGobernadorEstadoS,
        nombreGobernadorEstado: this.nombreGobernadorEstado,
        resultadoGobernadorEstado: this.resultadoNombreGobernadorEstado,
        idPartidoPoliticoGobernadorEstado: this.idPartidoPoliticoGobernadorEstado,
        conocePresidenteMexico: this.conocePresidenteMexicoS,
        nombrePresidenteMexico: this.nombrePresidenteMexico,
        resultadoNombrePresidenteMexico: this.resultadoNombrePresidenteMexico,
        idPartidoPoliticoPresidenteMexico: this.idPartidoPoliticoPresidenteMexico,
        idEleccionesEstado: this.idEleccionesEstado,
        nombreCandidatoPanEstadoMexico: this.nombreCandidatoPanEstadoMexico,
        resultadoNombreCandidatoPanEstadoMexico: this.resultadoNombreCandidatoPanEstadoMexico,
        nombreCandidatoPriEstadoMexico: this.nombreCandidatoPriEstadoMexico,
        resultadoNombreCandidatoPriEstadoMexico: this.resultadoNombreCandidatoPriEstadoMexico,
        nombreCandidatoPrdEstadoMexico: this.nombreCandidatoPrdEstadoMexico,
        resultadoNombreCandidatoPrdEstadoMexico: this.resultadoNombreCandidatoPrdEstadoMexico,
        nombreCandidatoMorenaEstadoMexico: this.nombreCandidatoMorenaEstadoMexico,
        resultadoNombreCandidatoMorenaEstadoMexico: this.resultadoNombreCandidatoMorenaEstadoMexico,
      }
    )
  }

  showCard() {
    this.activaCard = true;
  }

}
