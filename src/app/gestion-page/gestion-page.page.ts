import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { GestionCartaPage } from '../gestion-carta/gestion-carta.page';
import { GestionInspeccionAguaPage } from '../gestion-inspeccion-agua/gestion-inspeccion-agua.page';
import { GestionInspeccionPredioPage } from '../gestion-inspeccion-predio/gestion-inspeccion-predio.page';
import { GestionLegalPage } from '../gestion-legal/gestion-legal.page';

@Component({
  selector: 'app-gestion-page',
  templateUrl: './gestion-page.page.html',
  styleUrls: ['./gestion-page.page.scss'],
})
export class GestionPagePage implements OnInit {

  modal:any;
  agua: boolean = false;
  predio: boolean = false;
  constructor(
    private modalCtrl: ModalController,
    private router:Router,
    private storage: Storage
  ) { }

  async ngOnInit() {
    const tipo = await this.storage.get('tipo');
    if(tipo == 'Agua') {
      this.agua = true;
      this.predio = false;
    } else if (tipo == 'Predio') {
      this.predio = true;
      this.agua = false;
    }
  }


  async inspeccionAgua() {
    const modal = await this.modalCtrl.create({
      component: GestionInspeccionAguaPage
    });

    modal.present();

    modal.onDidDismiss().then( data => {
      this.router.navigate(['home/tab2'])
    })
  }

  async inspeccionPredio() {
    const modal = await this.modalCtrl.create( {
      component: GestionInspeccionPredioPage
    });

    modal.present();

    modal.onDidDismiss().then( data => {
      this.router.navigate(['home/tab2']);
    })
  }

  async cartaInvitacion() {
    const modal = await this.modalCtrl.create({
      component: GestionCartaPage
    });

    modal.present()

    modal.onDidDismiss().then( data => {
      this.router.navigate(['home/tab2']);
    })
  }

  async legal() {
    const modal = await this.modalCtrl.create({
      component: GestionLegalPage
    });

    modal.present()

    modal.onDidDismiss().then( data => {
      this.router.navigate(['home/tab2']);
    })
  }

}
