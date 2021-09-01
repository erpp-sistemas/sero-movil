import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { RestService } from '../services/rest.service';

@Component({
  selector: 'app-sincronizar-gestiones',
  templateUrl: './sincronizar-gestiones.page.html',
  styleUrls: ['./sincronizar-gestiones.page.scss'],
})
export class SincronizarGestionesPage implements OnInit {

  servicios: any; // para almacenar los servicios (select * from serviciosPlazaUser where id_plaza = ?)

  constructor(
    private router: Router,
    private callNumber: CallNumber,
    private rest: RestService
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

  sync(id_servicio) {
    console.log(id_servicio);
    //this.router.navigateByUrl('/sincronizar-agua');
  }

  syncPredio() {
    this.router.navigateByUrl('/sincronizar-predio');
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
