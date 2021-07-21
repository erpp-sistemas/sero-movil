import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { RestService } from '../services/rest.service';

@Component({
  selector: 'app-sincronizar-agua',
  templateUrl: './sincronizar-agua.page.html',
  styleUrls: ['./sincronizar-agua.page.scss'],
})
export class SincronizarAguaPage implements OnInit {

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
    this.accounts = await this.rest.getAccountsGestionesAgua();
    console.log("Inspecciones agua: ", this.accounts);
  }


  async syncAccounts() {
    this.loading = await this.loadingCtrl.create({
      message: 'Enviando información',
      spinner: 'dots'
    });
    this.loading.present();

    // enviar toas las gestiones de todos los roles
    await this.rest.sendAguaInspeccionAgua();
    //await this.rest.sendAguaCartaInvitacion();
    //await this.rest.sendAguaLegal();
  }


  syncAccount( cuenta, rol ) {

  }


  deleteAccount( cuenta, rol ) {
    
  } 


}
