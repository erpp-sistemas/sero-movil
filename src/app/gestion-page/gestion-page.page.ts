import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { GestionInspeccionAguaPage } from '../gestion-inspeccion-agua/gestion-inspeccion-agua.page';

@Component({
  selector: 'app-gestion-page',
  templateUrl: './gestion-page.page.html',
  styleUrls: ['./gestion-page.page.scss'],
})
export class GestionPagePage implements OnInit {

  modal:any;

  constructor(
    private modalCtrl: ModalController,
    private router:Router
  ) { }

  ngOnInit() {
  }


  async inspeccion() {
    const modal = await this.modalCtrl.create({
      component: GestionInspeccionAguaPage
    });

    modal.present();

    modal.onDidDismiss().then( data => {
      this.router.navigate(['home/tab2'])
    })
  }

}
