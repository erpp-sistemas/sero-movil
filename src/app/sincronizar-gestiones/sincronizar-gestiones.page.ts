import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { LoadingController } from '@ionic/angular';
import { RestService } from '../services/rest.service';

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
    private callNumber: CallNumber,
    private rest: RestService,
    private loadingCtrl: LoadingController
  ) { }

  async ngOnInit() {
    await this.obtenerServicios();
  }


  // ionViewDidEnter() {
  //   this.obtenerServicios();
  // }

  async obtenerServicios() {
    this.servicios = await this.rest.mostrarServiciosAll();
    console.log(this.servicios);
  }

  async syncAccounts() {
    this.loading = await this.loadingCtrl.create({
      message: 'Enviando información',
      spinner: 'dots'
    });

    await this.loading.present();

    await this.rest.sendInspeccion();
    await this.rest.sendCartaInvitacion();

    await this.rest.sendServiciosPublicos();
    this.loading.dismiss();
    this.router.navigateByUrl('home/tab1');
  }

  sync(id_servicio) {
    console.log(id_servicio);
    this.router.navigate(['sync-acciones', id_servicio]);
  }

  syncServicios() {
    this.router.navigateByUrl('/sincronizar-servicios');
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
