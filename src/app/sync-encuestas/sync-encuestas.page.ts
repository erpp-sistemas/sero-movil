import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { DblocalService } from '../services/dblocal.service';
import { MessagesService } from '../services/messages.service';
import { RestService } from '../services/rest.service';

@Component({
  selector: 'app-sync-encuestas',
  templateUrl: './sync-encuestas.page.html',
  styleUrls: ['./sync-encuestas.page.scss'],
})
export class SyncEncuestasPage implements OnInit {

  loading: any
  encuestas: any[]

  constructor(
    private loadinController: LoadingController,
    private dblocal: DblocalService,
    private rest: RestService,
    private message: MessagesService
  ) { }

  async ngOnInit() {
    await this.getAccounts()
  }


  async getAccounts() {

    this.loading = await this.loadinController.create({
      message: 'Cargando el listado de encuestas',
      spinner: 'dots'
    });

    await this.loading.present();

    await this.getEncuestasLocales();

    this.loading.dismiss();

  }

  async getEncuestasLocales() {
    const data = await this.dblocal.getRegistroEncuestasLocal()
    this.encuestas = data.map(enc => {
      return {
        id: enc.id,
        data_json: JSON.parse(enc.data_json),
        fecha: enc.fecha
      }
    })
  }

  deleteEncuesta(id_encuesta: any, showMessage: boolean, reload: boolean) {
    this.dblocal.deleteRegistroEncuestaLocal(id_encuesta).then(async (res: string) => {
      if (showMessage) this.message.showToast(res);
      if( reload ) await this.getAccounts();
    }).catch((error: string) => {
      this.message.showToast(error)
    })
  }

  async syncEncuesta(encuesta: any) {

    this.loading = await this.loadinController.create({
      message: 'Enviando la encuesta',
      spinner: 'dots'
    });

    await this.loading.present()

    const message = await this.rest.sendOneRegisterEncuesta(encuesta.data_json)
    if (message === 'No se pudo enviar') {
      this.message.showToast("No se pudo enviar la encuesta verificar con sistemas")
      return
    }
    this.message.showToast("Encuesta enviada correctamente")
    this.deleteEncuesta(encuesta.id, false, true)

    this.loading.dismiss()

  }


  async syncEncuestas() {

    this.loading = await this.loadinController.create({
      message: 'Enviando la encuesta',
      spinner: 'dots'
    });

    await this.loading.present()

    for (let encuesta of this.encuestas) {
      const message = await this.rest.sendOneRegisterEncuesta(encuesta.data_json)
      if (message === 'No se pudo enviar') {
        this.message.showToast("No se pudo enviar la encuesta verificar con sistemas")
        return
      }
      this.message.showToast("Encuesta enviada correctamente")
      this.deleteEncuesta(encuesta.id, false, false)
    }

    this.loading.dismiss()
    this.getAccounts()

  }



}
