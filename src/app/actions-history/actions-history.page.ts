import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { MessagesService } from '../services/messages.service';
import { RestService } from '../services/rest.service';

@Component({
  selector: 'app-actions-history',
  templateUrl: './actions-history.page.html',
  styleUrls: ['./actions-history.page.scss'],
})

export class ActionsHistoryPage implements OnInit {

  acciones: any;

  @Input() idPlaza: number; 
  @Input() account: string;


  constructor(
    private rest: RestService,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private message: MessagesService
  ) { }

  ngOnInit() {
    this.getActionsHistory();
  }

  async getActionsHistory() {

    let loading = await this.loadingController.create({
      message: 'Obteniendo las acciones históricas',
      spinner: 'dots'
    });

    await loading.present();

    this.acciones = await this.rest.getActionsHistory(this.idPlaza, this.account);

    if(this.acciones.length === 0) {
      this.message.showAlert("Esta cuenta no tiene acciones históricas aún");
      loading.dismiss();
      this.modalController.dismiss(); 
    }

    loading.dismiss();

  }

  back() {
    this.modalController.dismiss();
  }

}


