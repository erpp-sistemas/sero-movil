import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
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
    private router:Router,
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


}
