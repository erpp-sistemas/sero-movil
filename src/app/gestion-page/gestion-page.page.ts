import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { GestionCartaPage } from '../gestion-carta/gestion-carta.page';
import { GestionInspeccionAguaPage } from '../gestion-inspeccion-agua/gestion-inspeccion-agua.page';
import { GestionInspeccionPredioPage } from '../gestion-inspeccion-predio/gestion-inspeccion-predio.page';
import { GestionLegalPage } from '../gestion-legal/gestion-legal.page';
import { CallNumber } from '@ionic-native/call-number/ngx';

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
    private storage: Storage,
    private callNumber: CallNumber
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
    // const modal = await this.modalCtrl.create({
    //   component: GestionInspeccionAguaPage
    // });

    // modal.present();

    // modal.onDidDismiss().then( data => {
    //   this.router.navigate(['home/tab2'])
    // })
    this.router.navigateByUrl('/gestion-inspeccion-agua');
  }

  async inspeccionPredio() {
    // const modal = await this.modalCtrl.create( {
    //   component: GestionInspeccionPredioPage
    // });

    // modal.present();

    // modal.onDidDismiss().then( data => {
    //   this.router.navigate(['home/tab2']);
    // })
    this.router.navigateByUrl('/gestion-inspeccion-predio');
  }

  async cartaInvitacion() {
    // const modal = await this.modalCtrl.create({
    //   component: GestionCartaPage
    // });

    // modal.present()

    // modal.onDidDismiss().then( data => {
    //   this.router.navigate(['home/tab2']);
    // })
    this.router.navigateByUrl('/gestion-carta');
  }

  async legal() {
    // const modal = await this.modalCtrl.create({
    //   component: GestionLegalPage
    // });

    // modal.present()

    // modal.onDidDismiss().then( data => {
    //   this.router.navigate(['home/tab2']);
    // })
    this.router.navigateByUrl('/gestion-legal');
  }


  navegar(tipo) {
    if (tipo == 1) {
      this.router.navigateByUrl('home/tab1');
    } else if (tipo == 2) {
      this.router.navigateByUrl('home/tab2');
    } else if (tipo == 3) {
      this.router.navigateByUrl('home/tab3');
    } else if (tipo == 4) {
      this.router.navigateByUrl('/servicios-publicos');
    } else if (tipo == 5) {

      this.callNumber.callNumber('18001010101', true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));

    }
  } 


}
