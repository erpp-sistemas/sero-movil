import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-select-partidos',
  templateUrl: './select-partidos.component.html',
  styleUrls: ['./select-partidos.component.scss'],
})
export class SelectPartidosComponent implements OnInit {

  @Input() idPartidoPolitico: string = '';
  @Output() sendIdPartido = new EventEmitter<string>();

  partidosSQL: any[] = []

  constructor(
    private rest: RestService
  ) { }

  ngOnInit() { 
    this.obtenerInfoPartidosLocalesSQL()
  }

  async obtenerInfoPartidosLocalesSQL() {
    const data = []
    this.partidosSQL = data;
  }

  resultIdPartido(event: any) {
    let result = event.target.value
    this.sendIdPartido.emit(result)
  }

}
