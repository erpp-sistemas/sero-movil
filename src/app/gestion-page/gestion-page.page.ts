import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { CallNumber } from '@ionic-native/call-number/ngx';

import { Proceso } from '../interfaces/Procesos';
import { DblocalService } from '../services/dblocal.service';

@Component({
  selector: 'app-gestion-page',
  templateUrl: './gestion-page.page.html',
  styleUrls: ['./gestion-page.page.scss'],
})
export class GestionPagePage implements OnInit {

  modal:any;
  procesos: Proceso[];

  constructor(
    //private modalCtrl: ModalController,
    private router:Router,
    private callNumber: CallNumber,
    private dbLocalService: DblocalService,
    private storage: Storage
  ) { }

  async ngOnInit() {
    await this.getProcesosByIdPlaza();
  }

  async getProcesosByIdPlaza() {
    const id_plaza = await this.storage.get('IdPlazaActiva');
    // this.procesos = await this.rest.obtenerProcesosByIdPlaza(id_plaza);
    this.procesos = await this.dbLocalService.getProcessLocalByIdPlaza(id_plaza);
    console.log(this.procesos);
  }

  irProceso(id_proceso: number) {
    let procesoUrl = this.procesos.filter(proceso => {
      return proceso.id_proceso === id_proceso
    });
    let url = procesoUrl[0].url_aplicacion_movil;
    this.router.navigateByUrl(url);
  }


  navegar(tipo) {
    if (tipo == 1) {
      this.router.navigateByUrl('home/tab1');
    } else if (tipo == 2) {
      this.router.navigateByUrl('home/tab2');
    } else if (tipo == 3) {
      this.router.navigateByUrl('home/tab3');
    } else if (tipo == 4) {
      this.router.navigateByUrl('home/tab4');
    } else if (tipo == 5) {

      this.callNumber.callNumber('911', true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));

    }
  } 


}
