import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActionsHistoryPage } from 'src/app/actions-history/actions-history.page';
import { DataInfoAccount } from 'src/app/interfaces';
import { PhotosHistoryPage } from 'src/app/photos-history/photos-history.page';

@Component({
  selector: 'app-info-account',
  templateUrl: './info-account.component.html',
  styleUrls: ['./info-account.component.scss'],
})
export class InfoAccountComponent implements OnInit {

  @Input() data: DataInfoAccount;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
   
  }


  async goActions() {
    const modal = await this.modalController.create({
      component: ActionsHistoryPage,
      componentProps: {
        "account": this.data.account,
        "idPlaza": this.data.id_plaza
      }
    });
    await modal.present();
  }


  async goPhotos() {
    const modal = await this.modalController.create({
      component: PhotosHistoryPage,
      componentProps: {
        "account": this.data.account,
        "idPlaza": this.data.id_plaza
      }
    });
    await modal.present();
  }



}
