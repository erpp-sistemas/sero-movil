import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataAprobacionAutoridades } from 'src/app/interfaces/AprobacionAutoridades';

@Component({
  selector: 'app-card-aprobacion-autoridades',
  templateUrl: './card-aprobacion-autoridades.component.html',
  styleUrls: ['./card-aprobacion-autoridades.component.scss'],
})
export class CardAprobacionAutoridadesComponent implements OnInit {

  @Output() sendDataAprobacion = new EventEmitter<DataAprobacionAutoridades>()

  activaCard: boolean = false;

  resultadoAprobacionPresidenteMunicipal: string = '';
  resultadoAprobacionGobernadorEstado: string = '';
  resultadoAprobacionPresidenteMexico: string = '';
  resultadoEconomicoPresidenteMunicipal: string = '';
  resultadoEconomicoGobernadorEstado: string = '';
  resultadoEconomicoPresidenteMexico: string = '';
  resultadoInseguridadPresidenteMunicipal: string = '';
  resultadoInseguridadGobernadorEstado: string = '';
  resultadoInseguridadPresidenteMexico: string = '';
  idPrincipalProblemaMunicipio: string = '';
  idPrincipalProblemaEstado: string = '';
  idPrincipalProblemaPais: string = '';


  constructor() { }

  ngOnInit() { }

  completeCard() {
    this.activaCard = false;
    this.sendDataAprobacion.emit(
      {
        resultadoAprobacionPresidenteMexico: this.resultadoAprobacionPresidenteMunicipal,
        resultadoAprobacionGobernadorEstado: this.resultadoAprobacionGobernadorEstado,
        resultadoAprobacionPresidenteMunicipal: this.resultadoAprobacionPresidenteMexico,
        resultadoEconomicoPresidenteMunicipal: this.resultadoEconomicoPresidenteMunicipal,
        resultadoEconomicoGobernadorEstado: this.resultadoEconomicoGobernadorEstado,
        resultadoEconomicoPresidenteMexico: this.resultadoEconomicoPresidenteMexico,
        resultadoInseguridadPresidenteMunicipal: this.resultadoInseguridadPresidenteMunicipal,
        resultadoInseguridadGobernadorEstado: this.resultadoInseguridadGobernadorEstado,
        resultadoInseguridadPresidenteMexico: this.resultadoInseguridadPresidenteMexico,
        idPrincipalProblemaMunicipio: this.idPrincipalProblemaMunicipio,
        idPrincipalProblemaEstado: this.idPrincipalProblemaEstado,
        idPrincipalProblemaPais: this.idPrincipalProblemaPais
      }
    )
  }

  showCard() {
    this.activaCard = true;
  }

}
