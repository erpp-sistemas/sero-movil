import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';
import { Storage } from '@ionic/storage';
import { PushNotification } from '../interfaces/PushNotifications';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  userId: any;

  apiUpdateUserIdPushSQL = 'https://ser0.mx/seroMovil.aspx?query=sp_user_id_push';
  apiGetPushNotifications = 'https://ser0.mx/seroMovil.aspx?query=sp_obtener_push_notification';
  apiDeletePushNotification = 'https://ser0.mx/seroMovil.aspx?query=sp_disabled_push_notification';

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
    let sql = `${this.apiUpdateUserIdPushSQL} ${idUsuario}, '${this.userId}'`;
    try {
      this.http.post(sql, null).subscribe((data) => {
        console.log(data);
      })
    } catch (error) {
      console.log("Error en al actualizar el idUsuario push notifications ", error);
    }
  }


  async getPushNotificationsByIdUser() {
    let idUsuario = await this.storage.get('IdAspUser');
    let sql = `${this.apiGetPushNotifications} ${idUsuario}`
    console.log(sql);
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
    let sql = `${this.apiDeletePushNotification} '${id_push_notification}', ${idUsuario}`;
    console.log(sql);
    return new Promise((resolve, reject) => {
      try {
        this.http.post(sql, null).subscribe((data) => {
          resolve(data)
        });
      } catch (error) {
        reject(error)
      }
    })
  }


}
