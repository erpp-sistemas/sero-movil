import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataPreferenciaElectoralDos } from 'src/app/interfaces/PreferenciaElectoral';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-card-preferencia-electoral',
  templateUrl: './card-preferencia-electoral.component.html',
  styleUrls: ['./card-preferencia-electoral.component.scss'],
})
export class CardPreferenciaElectoralComponent implements OnInit {
 
  @Output() sendDataPreferenciaElectoral = new EventEmitter<DataPreferenciaElectoralDos>();

  alianzasPoliticas: any[] = [];

  activaCard: boolean = true

  idVotoPartidoPoliticoEstadoMexico: string = '';
  idAlianzaVotoEstadoMexico: string = '';
  idVotoPartidoPoliticoPais: string = '';
  idVotoPartidoPoliticoMunicipio: string = '';
  idAlianzaVotoMunicipio: string = '';


  constructor(private rest: RestService) { }

  ngOnInit() {
    this.getAlianzasPoliticas()
  }

  async getAlianzasPoliticas() {
    let data = await this.rest.obtenerAlianzasPoliticasLocal();
    this.alianzasPoliticas = data
  }

  showCard() {
    this.activaCard = true
  }

  completeCard() {
    this.activaCard = false;
    this.sendDataPreferenciaElectoral.emit(
      {
        idVotoPartidoPoliticoEstadoMexico: this.idVotoPartidoPoliticoEstadoMexico,
        idAlianzaVotoEstadoMexico: this.idAlianzaVotoEstadoMexico,
        idVotoPartidoPoliticoPais: this.idVotoPartidoPoliticoPais,
        idVotoPartidoPoliticoMunicipio: this.idVotoPartidoPoliticoMunicipio,
        idAlianzaVotoMunicipio: this.idAlianzaVotoMunicipio,
      }
    )
  }

}
