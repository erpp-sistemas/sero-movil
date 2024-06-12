import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { DblocalService } from '../services/dblocal.service';
import { RegisterService } from '../services/register.service';

@Component({
  selector: 'app-sincronizar-gestiones',
  templateUrl: './sincronizar-gestiones.page.html',
  styleUrls: ['./sincronizar-gestiones.page.scss'],
})
export class SincronizarGestionesPage implements OnInit {

  servicios: any; // para almacenar los servicios (select * from serviciosPlazaUser)
  loading:any;

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private dbLocalService: DblocalService,
    private registerService: RegisterService
  ) { }

  async ngOnInit() {
    await this.obtenerServicios();
  }


  async obtenerServicios() {
    this.servicios = await this.dbLocalService.mostrarServiciosAll();
    console.log(this.servicios);
  }

  async syncAccounts() {
    this.loading = await this.loadingCtrl.create({
      message: 'Enviando información',
      spinner: 'dots'
    });

    await this.loading.present();

    await this.registerService.sendInspeccion();
    await this.registerService.sendCartaInvitacion();
    await this.registerService.sendCortes();
    await this.registerService.sendLegal();

    await this.registerService.sendServiciosPublicos();
    this.loading.dismiss();
    this.router.navigateByUrl('home/tab1');
  }

  sync(id_servicio) {
    this.router.navigate(['sync-acciones', id_servicio]);
  }

  syncServicios() {
    this.router.navigateByUrl('/sincronizar-servicios');
  }

  syncEncuestas() {
    this.router.navigateByUrl('/sync-encuestas');
  }



}
