import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataPreferenciaElectoral } from 'src/app/interfaces/PreferenciaElectoral';

@Component({
  selector: 'app-card-preferencia-electoral',
  templateUrl: './card-preferencia-electoral.component.html',
  styleUrls: ['./card-preferencia-electoral.component.scss'],
})
export class CardPreferenciaElectoralComponent implements OnInit {

  @Output() sendDataPreferenciaElectoral = new EventEmitter<DataPreferenciaElectoral>();

  activaCard: boolean = false

  idVotoPartidoPoliticoEstadoMexico: string = '';
  idAlianzaVotoEstadoMexico: string = '';
  idVotoPartidoPoliticoPais: string = '';
  idAlianzaVotoPais: string = ''
  idVotoPartidoPoliticoMunicipio: string = '';
  idAlianzaVotoMunicipio: string = '';

  idPartidoPiensaGanariaEstadoMexico: string = '';
  idAlianzaPiensaGanariaEstadoMexico: string = '';
  idPartidoPiensaGanariaPais: string = '';
  idAlianzaPiensaGanariaPais: string = '';
  idPartidoPiensaGanariaMunicipio: string = '';
  idAlianzaPiensaGanariaMunicipio: string = '';


  constructor() { }

  ngOnInit() {}

  completeCard() {
    this.activaCard = false;
    this.sendDataPreferenciaElectoral.emit(
      {
        idVotoPartidoPoliticoEstadoMexico: this.idVotoPartidoPoliticoEstadoMexico,
        idAlianzaVotoEstadoMexico: this.idAlianzaVotoEstadoMexico,
        idVotoPartidoPoliticoPais: this.idVotoPartidoPoliticoPais,
        idAlianzaVotoPais: this.idAlianzaVotoPais,
        idVotoPartidoPoliticoMunicipio: this.idVotoPartidoPoliticoMunicipio,
        idAlianzaVotoMunicipio: this.idAlianzaVotoMunicipio,
        idPartidoPiensaGanariaEstadoMexico: this.idPartidoPiensaGanariaEstadoMexico,
        idAlianzaPiensaGanariaEstadoMexico: this.idAlianzaPiensaGanariaEstadoMexico,
        idPartidoPiensaGanariaPais: this.idPartidoPiensaGanariaPais,
        idAlianzaPiensaGanariaPais: this.idAlianzaPiensaGanariaPais,
        idPartidoPiensaGanariaMunicipio: this.idPartidoPiensaGanariaMunicipio,
        idAlianzaPiensaGanariaMunicipio: this.idAlianzaPiensaGanariaMunicipio
      }
    )
  }

  showCard() {
    this.activaCard = true;
  }

}
