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
  apiInsertPushNotificationSQL = 'https://ser0.mx/seroMovil.aspx?query=sp_registro_push_notifications';
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

    this.oneSignal.handleNotificationReceived().subscribe(async (noti) => {
      // do something when notification is received
      console.log("Notificación recibida", noti);
      let { notificationID, title, body } = noti.payload;
      let image = noti.payload.bigPicture; // puede ser undefined
      if(image) {
        console.log("Trae imagen");
        await this.insertRegistroPushNotifications(notificationID, title, body, image);
      } else {
        console.log("No trae imagen");
        await this.insertRegistroPushNotifications(notificationID, title, body, 'none');
      }
    });

    this.oneSignal.handleNotificationOpened().subscribe(async (noti) => {
      // do something when a notification is opened
      console.log("Notificacion abierta", noti);
      let id_push_notification = noti.notification.payload.notificationID;
      await this.updateEstatusLeido(id_push_notification);
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
    console.log(sql);
    try {
      this.http.post(sql, null).subscribe((data) => {
        console.log(data);
      })
    } catch (error) {
      console.log("Error en al actualizar el idUsuario push notifications ", error);
    }
  }

  async insertRegistroPushNotifications(id_push_notification: string, titulo: string, mensaje: string, url_img: string) {
    let idUsuario = await this.storage.get('IdAspUser');
    let leido = 0;
    let sql = `${this.apiInsertPushNotificationSQL} ${idUsuario}, '${this.userId}', '${id_push_notification}', '${titulo}', '${mensaje}', ${leido}, '${url_img}'`;
    console.log(sql);
    try {
      this.http.post(sql, null).subscribe((data) => {
        console.log(data);
      })
    } catch (error) {
      console.log("Error al insertar la informacion de la notificacion ", error);
    }
  }

  async updateEstatusLeido(id_push_notification: string) {
    let idUsuario = await this.storage.get('IdAspUser');
    let leido = 1;
    let sql = `${this.apiInsertPushNotificationSQL} ${idUsuario}, '${this.userId}', '${id_push_notification}', '0', '0', ${leido}, 'none'`;
    console.log(sql);
    try {
      this.http.post(sql, null).subscribe((data) => {
        console.log(data);
      })
    } catch (error) {
      console.log("Error al actualizar el estatus de liedo de la notificacion ", error);
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
