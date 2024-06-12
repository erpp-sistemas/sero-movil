import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { MessagesService } from '../services/messages.service';
import { RegisterService } from '../services/register.service';



@Component({
  selector: 'app-sincronizar-servicios',
  templateUrl: './sincronizar-servicios.page.html',
  styleUrls: ['./sincronizar-servicios.page.scss'],
})
export class SincronizarServiciosPage implements OnInit {

  accounts:any;
  loading:any;
  totalAccounts:any;

  constructor(
    private loadingCtrl: LoadingController,
    private router: Router,
    private message: MessagesService,
    private registerService: RegisterService,
  ) { }

  ngOnInit() {
    this.getAccounts();
  }

  async getAccounts() {

    this.loading = await this.loadingCtrl.create({
      message: 'Cargando el listado de servicios',
      spinner: 'dots'
    });

    await this.loading.present();
    
    await this.getTotal();
    await this.getInfoCuentas();

    this.loading.dismiss();
    
  }

  async getInfoCuentas() {
    this.accounts = await this.registerService.getAccountsGestionesServicios();
    console.log("Servicios publicos: ", this.accounts);
    if(this.accounts.length == 0) {
      this.message.showAlert("No tienes gestiones realizadas de servicios públicos!!!!");
      this.router.navigateByUrl('sincronizar-gestiones');
    }
  }

  async getTotal() {
    this.totalAccounts = await this.registerService.getTotalGestionesServicios();
    console.log("Total de gestiones " + this.totalAccounts);
  }

  async syncAccounts() {
    this.loading = await this.loadingCtrl.create({
      message: 'Enviando información',
      spinner: 'dots'
    });
    this.loading.present();

    await this.registerService.sendServiciosPublicos();
    
    this.loading.dismiss();
    this.router.navigateByUrl('home/tab1');
  }


}
