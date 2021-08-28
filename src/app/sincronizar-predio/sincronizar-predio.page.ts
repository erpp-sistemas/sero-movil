import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { RestService } from '../services/rest.service';
import { CallNumber } from '@ionic-native/call-number/ngx';


@Component({
  selector: 'app-sincronizar-predio',
  templateUrl: './sincronizar-predio.page.html',
  styleUrls: ['./sincronizar-predio.page.scss'],
})
export class SincronizarPredioPage implements OnInit {

  accounts:any;
  loading:any; 

  constructor(
    private rest: RestService,
    private loadingCtrl: LoadingController,
    private router:Router,
    private callNumber: CallNumber
  ) { }

  ngOnInit() {
    this.getAccounts();
  }

  async getAccounts() {
    this.accounts = await this.rest.getAccountsGestionesPredio();
    console.log("Inspecciones predio: ", this.accounts);
  }


  async syncAccounts() {
    this.loading = await this.loadingCtrl.create({
      message: 'Enviando información',
      spinner: 'dots'
    });
    this.loading.present();

    // enviar toas las gestiones de todos los roles
    //await this.rest.sendPredioInspeccionPredio();
    this.loading.dismiss();
    this.router.navigateByUrl('home/tab1');
  }


  syncAccount( cuenta, rol ) {

  }


  deleteAccount( cuenta, rol ) {
    
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
