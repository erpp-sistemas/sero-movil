import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { MessagesService } from '../services/messages.service';
import { RestService } from '../services/rest.service';
import { DataNivelConocmiento } from '../interfaces/NivelConocimiento'
import { DataAprobacionAutoridades } from '../interfaces/AprobacionAutoridades';
import { DataPreferenciaElectoral } from '../interfaces/PreferenciaElectoral';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
})
export class EncuestaPage implements OnInit {

  dataNivelConocimiento: DataNivelConocmiento = null; //18
  dataAprobacionAutoridades: DataAprobacionAutoridades = null; // 12
  dataPreferenciaElectoral: DataPreferenciaElectoral = null; // 12

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

  @Input() idPlaza: any;
  @Input() account: any;
  @Input() idServicioPlaza: any;

  ngOnInit() {
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
      idServicioPlaza: this.idServicioPlaza,
      account: this.account,
      fechaCaptura: this.fechaCaptura,
      ...this.dataNivelConocimiento,
      ...this.dataAprobacionAutoridades,
      ...this.dataPreferenciaElectoral
    }
    await this.gestionEncuesta(data);
  }

  async gestionEncuesta(data: any) {
    console.log(data);
    let estatus: string = ''
    try {
      await this.rest.gestionEncuesta(data);
      estatus = 'Realizado'
    } catch (error) {
      console.log(error);
      estatus = 'Error'
    }
    this.modalCtrl.dismiss({
      estatus
    });
  }

}
