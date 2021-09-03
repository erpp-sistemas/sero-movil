import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { LoadingController } from '@ionic/angular';
import { MessagesService } from '../services/messages.service';
import { RestService } from '../services/rest.service';

@Component({
  selector: 'app-sync-acciones',
  templateUrl: './sync-acciones.page.html',
  styleUrls: ['./sync-acciones.page.scss'],
})
export class SyncAccionesPage implements OnInit {

  loading: any;
  id_servicio_plaza: any;
  gestiones: any;
  totalGestiones: any;

  constructor(
    private rest: RestService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private message: MessagesService,
    private activeRoute: ActivatedRoute,
    private callNumber: CallNumber
  ) { }

  ngOnInit() {
    console.log("id_servicio_plaza: ", this.activeRoute.snapshot.paramMap.get('id_servicio_plaza'));
    this.id_servicio_plaza = this.activeRoute.snapshot.paramMap.get('id_servicio_plaza');
    this.listadoGestiones(this.id_servicio_plaza);
  }

  async listadoGestiones(idServicioPlaza) {
    console.log("Cargando el listado de acciones del servicio " + idServicioPlaza);
    this.gestiones = null;
    this.loading = await this.loadingCtrl.create({
      message: 'Cargando el listado de acciones',
      spinner: 'dots'
    });
    await this.loading.present();
    this.getInfo(idServicioPlaza);
    this.getInfoCuentas(idServicioPlaza);
    this.loading.dismiss();
  }

  async getInfo(idServicioPlaza) {
    this.totalGestiones = await this.rest.getTotalGestionadas(idServicioPlaza);
    console.log("Total de gestiones " + this.totalGestiones);
  }


  async getInfoCuentas(idServicioPlaza) {
    this.gestiones = await this.rest.getAccountsGestiones(idServicioPlaza);
    console.log(this.gestiones);
    if (this.gestiones.length == 0) {
      this.message.showAlert("No tienes gestiones realizadas en este servicio!!!!");
      this.router.navigateByUrl('sincronizar-gestiones');
    }
  }

  async syncAccounts() {
    this.loading = await this.loadingCtrl.create({
      message: 'Enviando información',
      spinner: 'dots'
    });

    await this.loading.present();

    await this.rest.sendInspeccionByIdServicio(this.id_servicio_plaza);
    await this.rest.sendCartaInvitacionByIdServicio(this.id_servicio_plaza);
    this.loading.dismiss();
    this.router.navigateByUrl('home/tab1');
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
