import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { RestService } from '../services/rest.service';

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
    //await this.rest.sendAguaInspeccionAgua();
    //await this.rest.sendAguaCartaInvitacion();
    //await this.rest.sendAguaLegal();
  }


  syncAccount( cuenta, rol ) {

  }


  deleteAccount( cuenta, rol ) {
    
  } 

}
