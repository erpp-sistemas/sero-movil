import { Component, OnInit } from '@angular/core';
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
    private push: PushService
  ) { }

  ngOnInit() {
    
  }

  async ionViewDidEnter() {
    await this.getAllPushNotifications();
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

}
