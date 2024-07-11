import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/firestore';
import { MessagesService } from './messages.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from './rest.service';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { DblocalService } from './dblocal.service';
import { EncuestaGeneral, ServicioPublico, UserPlacesServices, UserFirebase, Gestor } from '../interfaces';
import { wihoutDuplicated } from '../../helpers'
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiObtenerServiciosUser = "https://ser0.mx/seroMovil.aspx?query=sp_obtener_servicios";
  apiObtenerServiciosPublicos = "https://ser0.mx/seroMovil.aspx?query=sp_obtener_servicios_publicos";
  apiObtenerGestores = "https://ser0.mx/seroMovil.aspx?query=sp_obtener_gestores_plaza";
  apiUpdateAppVersion = "https://ser0.mx/seroMovil.aspx?query=sp_user_app_version";
  userInfo: UserFirebase;
  modal: any;
  photo_user: string = ''


  constructor(
    public firebaseAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private mensaje: MessagesService,
    private router: Router,
    private storage: Storage,
    private rest: RestService,
    private http: HttpClient,
    private modalCtrl: ModalController,
    private appVersion: AppVersion,
    private dbLocalService: DblocalService,
    private userService: UsersService
  ) { }


  /**
   ** Metodo que hace la peticion a firebase para la autenticacion
   * @param email 
   * @param password 
   * @returns Promise
   */
  loginFirebase(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.firebaseAuth.signInWithEmailAndPassword(email, password).then(user => {
        const uid = user.user.uid;
        let subscribe = this.getUserInfo(uid).subscribe(async (userInfoFirebase: UserFirebase) => {

          if (!userInfoFirebase) return this.mensaje.showAlert("Usuario no creado en la app móvil");

          if (!userInfoFirebase.isActive) {
            this.mensaje.showAlert("Usuario desactivado");
            this.logout();
            return
          }

          this.userInfo = userInfoFirebase

          if (this.userInfo.IMEI === '') { //* USUARIO NUEVO
            subscribe.unsubscribe();
            await this.getAndInsertData(uid)
            resolve(userInfoFirebase);
            return;
          }

          if (this.userInfo.IMEI !== '') {  //* EL USUARIO NO ES NUEVO
            let emailLocal = await this.storage.get("Email");
            let nombreUser = await this.storage.get("Nombre")
            if (this.userInfo.email == emailLocal) {
              subscribe.unsubscribe();
              await this.getAndInsertData(uid)
              this.mensaje.showAlert("Bienvenid@ " + nombreUser);
              resolve(nombreUser)
            }
            else {
              subscribe.unsubscribe();
              await this.getAndInsertData(uid)
              await this.storage.set("total", null);
              await this.storage.set("FechaSync", null);
              this.dbLocalService.deleteInfo();
              let nombreUsuario = await this.storage.get("Nombre")
              resolve(nombreUsuario)
            }
          }

          subscribe.unsubscribe();

        }) // getUserInfo
      }) // signInWithEmailAndPassword
        .catch(error => reject(error));
    })
  }


  getUserInfo(uid: string) {
    return this.firestore.collection('usersErpp').doc(uid).valueChanges()
  }


  async getAndInsertData(id: string) {
    await this.getPlacesAndServicesUser(this.userInfo.idaspuser);
    await this.saveUserInfoStorage(this.userInfo);
    await this.getServicesPublic();
    await this.obtenerCatTareaAndInsert()
    await this.getUsersPlaces();
    await this.saveDataCell(id);
  }


  async getPlacesAndServicesUser(idUser: number) {
    await this.dbLocalService.deleteServicios();
    this.http.get(this.apiObtenerServiciosUser + " " + idUser).subscribe((data: UserPlacesServices[]) => {
      this.insertServices(data);
    })
  }


  async insertServices(data: UserPlacesServices[]) {
    this.photo_user = await this.getPhotoUser(data[0].foto)
    await this.storage.set('Foto', this.photo_user)
    for (let servicio of data) {
      this.dbLocalService.insertarServiciosSQL(servicio);
    }
    await this.getDataEncuestas(data)
  }


  async getDataEncuestas(data: UserPlacesServices[]) {
    const places = data.map(upls => upls.id_plaza)
    const places_unique = wihoutDuplicated(places) // ? [2, 3]
    const api = `https://ser0.mx/seroMovil.aspx?query=sp_obtener_preguntas_encuesta`
    try {
      await this.dbLocalService.deleteDataEncuestas()
    } catch (error) {
      console.error("No se pudo borrar la informacion de la tabla local encuesta_general ", error)
    }
    for (let place of places_unique) {
      await this.rest.getDataSQL(`${api} ${place}`)
        .then(async (data: EncuestaGeneral[]) => {
          await this.insertDataEncuestas(data)
        })
        .catch(error => console.error(error))
    }
  }


  async insertDataEncuestas(data: EncuestaGeneral[]) {
    for (let encuesta of data) {
      try {
        await this.dbLocalService.insertDataEncuestas(encuesta)
      } catch (error) {
        console.error("No se pudo insertar la data de las encuestas")
      }
    }
  }


  async getServicesPublic() {
    await this.dbLocalService.deleteServiciosPublicos();
    this.http.get(this.apiObtenerServiciosPublicos).subscribe((data: ServicioPublico[]) => {
      this.insertServicePublic(data);
    })
  }


  async insertServicePublic(data: ServicioPublico[]) {
    data.forEach(async servicio => {
      await this.dbLocalService.insertarServicioPublicoSQL(servicio)
    });
  }


  async obtenerCatTareaAndInsert() {
    await this.rest.getCatTareas().then(async (data: any) => {
      for (let tarea of data) {
        try {
          await this.dbLocalService.insertCatTareaLocal(tarea)
        } catch (error) {
          console.log("No se pudo insertar la tarea ", error)
        }
      }
    })
  }

  async getUsersPlaces() {
    await this.dbLocalService.deleteGestores()
    this.http.get<Gestor[]>(this.apiObtenerGestores).subscribe(data => {
      this.insertGestores(data);
    })
  }

  async insertGestores(gestores: Gestor[]) {
    for (let gestor of gestores) {
      let { id_usuario, nombre, apellido_paterno, apellido_materno, foto: foto_url, id_plaza } = gestor;
      const foto = await this.getPhotoUser(foto_url)
      this.dbLocalService.insertaGestor({id_usuario, nombre, apellido_paterno, apellido_materno, foto, id_plaza});
    }
  }


  async saveUserInfoStorage(userInfo: any) {
    await this.storage.set('Nombre', userInfo.name);
    await this.storage.set('Email', userInfo.email);
    await this.storage.set('IdAspUser', userInfo.idaspuser)
    await this.storage.set('Password', userInfo.password)
  }


  async getPhotoUser(url_foto: string): Promise<string> {
    console.log(url_foto)
    return new Promise((resolve, reject) => {
      this.userService.getUrlFoto(url_foto).subscribe((response: Blob) => {
        const reader = new FileReader();
        reader.onload = async () => {
          const imageBase64 = reader.result;
          resolve(imageBase64.toString());
        };
        if (response) {
          reader.readAsDataURL(response);
        }
      }, (error => {
        console.log(error)
        reject(error)
      }))
    })
  }


  async saveDataCell(id: string) {
    await this.updateAppVersion();
    this.storage.set("IMEI", id);
    let dateDay = new Date().toISOString();
    let date: Date = new Date(dateDay);
    let ionicDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
    let fecha = ionicDate.toISOString();
    this.storage.set('lastSession', fecha);
    this.firestore.collection('usersErpp').doc(id).update({
      IMEI: id,
      lastSession: fecha,
      isActive: true
    });
  }


  async obtenerVersionApp() {
    let versionApp = await this.appVersion.getVersionNumber();
    return versionApp;
  }

  async updateAppVersion() {
    let appVersion = await this.obtenerVersionApp();
    let idUsuario = await this.storage.get('IdAspUser');
    let sql = `${this.apiUpdateAppVersion} ${idUsuario}, '${appVersion}'`
    try {
      this.http.post(sql, null).subscribe((data) => {
      })
    } catch (error) {
      console.log("No se pudo actualizar la version de la app en el SQL ", error);
    }
  }

  logout() {
    this.firebaseAuth.signOut().then(async () => {
      this.modal = await this.modalCtrl.create({
        component: LoginPage
      });
      this.modal.present()
      this.modal.onDidDismiss().then(data => {
        this.router.navigate(['home/tab1']);
      })
    })
  }


}
