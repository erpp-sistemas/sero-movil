import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';
import { Storage } from '@ionic/storage';
import { PushNotification } from '../interfaces/PushNotifications';
import { RestService } from './rest.service';
import { apiDeletePushNotification, apiGetPushNotifications, apiUpdateUserIdPushSQL } from '../api';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  userId: any;



  constructor(
    private oneSignal: OneSignal,
    private storage: Storage,
    private http: HttpClient,
    private router: Router
  ) { }

  configuracionInicial() {
    this.oneSignal.startInit('00c81861-87d7-433a-b35f-13e20477be8d', '265285825905');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    // cuando la recibe
    this.oneSignal.handleNotificationReceived().subscribe(async (noti) => {
      console.log("Notificación recibida", noti);
    });

    // cuando la abre
    this.oneSignal.handleNotificationOpened().subscribe(async (noti) => {
      console.log("Notificacion abierta", noti);
      this.router.navigateByUrl('/push-notifications')
    });

    // obtener el id del usuario
    this.oneSignal.getIds().then(async (user) => {
      this.userId = user.userId;
      await this.updateUserIdPushSQL();
    })

    this.oneSignal.endInit();
  }


  async updateUserIdPushSQL() {
    let idUsuario = await this.storage.get('IdAspUser');
    const data = {
      user_id: idUsuario,
      user_id_push: this.userId
    }
    try {
      this.http.post(apiUpdateUserIdPushSQL, data ).subscribe((data) => {
        //console.log(data);
      })
    } catch (error) {
      console.log("Error en al actualizar el idUsuario push notifications ", error);
    }
  }


  async getPushNotificationsByIdUser() {
    let idUsuario = await this.storage.get('IdAspUser');
    let sql = `${apiGetPushNotifications}/${idUsuario}`
    return new Promise<PushNotification[]>((resolve, reject) => {
      try {
        this.http.get(sql).subscribe((data:PushNotification[]) => {
          resolve(data)
        });
      } catch (error) {
        reject(error)
      }
    })
  }

  async deletePushNotificationById(id_push_notification: string) {
    let idUsuario = await this.storage.get('IdAspUser');
    const data = {
      id_push: id_push_notification,
      user_id: idUsuario
    }
    return new Promise((resolve, reject) => {
      try {
        this.http.post(apiDeletePushNotification, data).subscribe((data) => {
          resolve(data)
        });
      } catch (error) {
        reject(error)
      }
    })
  }


}
