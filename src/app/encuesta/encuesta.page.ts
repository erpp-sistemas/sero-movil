import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { MessagesService } from '../services/messages.service';
import { RestService } from '../services/rest.service';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
})
export class EncuestaPage implements OnInit {

  conocePresidente: number = 0;
  promesaCamp: number = 0;
  cualPromesa: string = '';
  gestionPresidente: number = 0;
  idServicioImpuesto: number = 0;
  fechaCaptura: string = '';
  activaPromesa: boolean = false;
  realizado: boolean = false;


  constructor(
    private modalCtrl: ModalController,
    private rest: RestService,
    private message: MessagesService,
    private loadingCtrl: LoadingController
  ) { }

  @Input() idPlaza;
  @Input() account;
  @Input() idServicioPlaza;

  ngOnInit() {
  }

  resultConocePresidente(event) {

    if (event.detail.value == 'conoceSi') {
      this.conocePresidente = 1
    } else {
      this.conocePresidente = 0
    }

  }

  resultPromesa(event) {
    if (event.detail.value == 'promesaSi') {
      this.promesaCamp = 1
      this.activaPromesa = true;
    } else {
      this.promesaCamp = 0
      this.activaPromesa = false;
    }
  }

  resultGestion(event) {
    if (event.detail.value == 'conformeGestionSi') {
      this.gestionPresidente = 1
    } else {
      this.gestionPresidente = 0
    }
  }

  async verify() {
    var dateDay = new Date().toISOString();
    let date: Date = new Date(dateDay);
    let ionicDate = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      )
    );

    this.fechaCaptura = ionicDate.toISOString();

    let data = {
      idPlaza: this.idPlaza,
      account: this.account,
      conocePresidente: this.conocePresidente,
      promesaCamp: this.promesaCamp,
      cualPromesa: this.cualPromesa,
      gestionPresidente: this.gestionPresidente,
      idServicioImpuesto: this.idServicioImpuesto,
      idServicioPlaza: this.idServicioPlaza,
      fechaCaptura: this.fechaCaptura
    }

    //console.log(data);
    await this.gestionEncuesta(data);
  }

  async gestionEncuesta(data) {
    await this.rest.gestionEncuesta(data);
    this.modalCtrl.dismiss({
      estatus: 'Realizado'
    });
  }

}
