import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { PushNotification } from '../interfaces/PushNotifications';
import { PushService } from '../services/push.service';

@Component({
  selector: 'app-push-notifications',
  templateUrl: './push-notifications.page.html',
  styleUrls: ['./push-notifications.page.scss'],
})
export class PushNotificationsPage implements OnInit {

  pushNotifications: PushNotification[] = [];
  pushCargadas: boolean = false;
  pushError: boolean = false;

  constructor(
    private router: Router,
    private push: PushService,
    private callNumber: CallNumber
  ) { }

  ngOnInit() {
    
  }

  ionViewDidEnter() {
    this.getAllPushNotifications();
  }

  async getAllPushNotifications() {
    this.push.getPushNotificationsByIdUser().then(push => {
      this.pushNotifications = push;
      this.pushCargadas = true;
      this.pushError = false
    }).catch(error => {
      console.log("No se obtuvieron las push ", error);
      this.pushError = true;
    })
  }

  deletePush(idPushNotification: string) {
    this.push.deletePushNotificationById(idPushNotification).then(res => {
      this.getAllPushNotifications();
    })
  }

  navegar(tipo) {
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
