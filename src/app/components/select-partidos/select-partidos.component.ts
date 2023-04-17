import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-select-partidos',
  templateUrl: './select-partidos.component.html',
  styleUrls: ['./select-partidos.component.scss'],
})
export class SelectPartidosComponent implements OnInit {

  //@Input() idPartidoPolitico: string = '';
  @Output() sendIdPartido = new EventEmitter<string>();

  constructor() { }

  ngOnInit() { }

  resultIdPartido(event: any) {
    let result = event.target.value
    this.sendIdPartido.emit(result)
  }

}
