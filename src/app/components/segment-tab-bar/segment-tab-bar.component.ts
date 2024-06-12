import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-segment-tab-bar',
  templateUrl: './segment-tab-bar.component.html',
  styleUrls: ['./segment-tab-bar.component.scss'],
})
export class SegmentTabBarComponent implements OnInit {

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private callNumber: CallNumber
  ) { }

  ngOnInit() { }

  navegar(tipo: any) {
    const current_route = this.router.url
    if (current_route.includes('carta') || current_route.includes('legal')) {
      this.showMessage(tipo)
    } else {
      this.goUrl(tipo)
    }
  }


  async showMessage(tipo: any) {
    const alert = await this.alertCtrl.create({
      header: "Messaje",
      subHeader: "¿Confirma que desea salir, se perderan los cambios?",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary",
          handler: blah => {
            console.log("Confirm Cancel: blah");
          }
        },
        {
          text: "Confirmar",
          cssClass: "secondary",
          handler: () => {
            this.goUrl(tipo);
          }
        }
      ]
    });
    await alert.present();
  }

  goUrl(tipo: any) {
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
