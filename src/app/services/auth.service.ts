import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/firestore';
import { MessagesService } from './messages.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from './rest.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  userInfo: any;


  constructor(
    public firebaseAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private mensaje: MessagesService,
    private router: Router,
    private storage: Storage,
    private rest: RestService
  ) { }


  loginFirebase(email: string, password: string) {

    return new Promise((resolve, reject) => {
      this.firebaseAuth.signInWithEmailAndPassword(email, password).then(user => {
        const id = user.user.uid;
        let createSubscribe = this.getUserInfo(id).subscribe(async userInfoFirebase => {
          this.userInfo = userInfoFirebase
          console.log(this.userInfo);
          // corroborar si el usuario esta activo
          if (this.userInfo.isActive) {
            if (this.userInfo.IMEI = '') {
              // usuario nuevo
              createSubscribe.unsubscribe();
              // guardar la informacion del usuario en el storage
              this.saveUserInfoStorage(this.userInfo);
              await this.storage.set("idFireBase", id);
              await this.storage.set("ActivateApp", 1);
              this.generaIdentificativo(id);
              resolve(userInfoFirebase);
            } else {
              // el usuario no es nuevo 
              let emailLocal = await this.storage.get("Email");
              let nombreUser = await this.storage.get("Nombre")
              console.log("El email del usuario con la sesion anterior es ", emailLocal);
              console.log("El usuario con la sesion anterior es ", nombreUser);
              if (this.userInfo.email == emailLocal) {
                console.log("Misma sesion del usuario en turno, correo en el storage mismo al correo ingresado");
                createSubscribe.unsubscribe();
                this.mensaje.showAlert("Bienvenid@ " + nombreUser);
                this.saveUserInfoStorage(this.userInfo);
                resolve(nombreUser)
              }
              else {
                console.log("Correo en el storage diferente al ingresado, puede ser null el correo en el storage");
                createSubscribe.unsubscribe();
                this.saveUserInfoStorage(this.userInfo);
                let nombreUsuario = await this.storage.get("Nombre")
                await this.storage.set("idFireBase", id)
                await this.storage.set("ActivateApp", "1");
                await this.storage.set("total", null);
                await this.storage.set("FechaSync", null);
                this.rest.deleteInfo();
                console.log(nombreUsuario);
                resolve(nombreUsuario)
              }
              createSubscribe.unsubscribe();
            }
          } else {
            this.mensaje.showAlert('Tu usario está desactivado');
            this.logout();
          }
        }) // getUserInfo
      }) // signInWithEmailAndPassword
        .catch(error => reject(error));
    })
  }

  getUserInfo(uid: string) {
    return this.firestore.collection('usersErpp').doc(uid).valueChanges()
  }

  saveUserInfoStorage(userInfo: any) {
    this.storage.set('Nombre', userInfo.name);
    this.storage.set('Email', userInfo.email);
    this.storage.set('IdAspUser', userInfo.idaspuser);
    this.storage.set('IdPlaza', userInfo.idplaza);
    this.storage.set('IdRol', userInfo.idrol);
    this.storage.set('Rol', userInfo.rol);
    this.storage.set('Plaza', userInfo.plaza);
    this.storage.set('IdUserChecador', userInfo.idUserChecador)
    this.storage.set('Password', userInfo.password)
    this.storage.set('ImgAvatar', userInfo.imgAvatar);
  }


  generaIdentificativo(id) {
    console.log("General el id tomando el idFirebase " + id);
    this.saveDataCell(id);
  }

  async saveDataCell(id) {
    let name = await this.storage.get("Nombre");
    this.storage.set("IMEI", id);
    let dateDay = new Date().toISOString();
    let date: Date = new Date(dateDay);
    let ionicDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
    let fecha = ionicDate.toISOString();
    this.storage.set('LastSession', fecha);
    this.firestore.collection('usersErpp').doc(id).update({
      IMEI: id,
      lastSession: fecha,
      isActive: true
    });
    this.firestore.collection('SessionRecords').doc(name + '-' + fecha).set({
      IMEI: id,
      lastSession: fecha,
      user: name
    })
  }

  register(email: string, password: string, name: string, idplaza: string, idrol: number, idaspuser: string, rol: string, plaza: string, idUserChecador: number, imgAvatar: string) {

    return new Promise((resolve, reject) => {

      this.firebaseAuth.createUserWithEmailAndPassword(email, password).then(res => {
        const uid = res.user.uid;

        this.firestore.collection('usersErpp').doc(uid).set({
          name: name,
          email: email,
          password: password,
          idplaza: idplaza,
          idrol: idrol,
          idaspuser: idaspuser,
          uid: uid,
          rol: rol,
          plaza: plaza,
          idUserChecador: idUserChecador,
          IMEI: "",
          lastSession: "",
          managedAccounts: 0,
          totalAccounts: 0,
          isActive: true,
          isHide: false,
          lastSync: '',
          urlImage: "",
          imgAvatar: imgAvatar
        })

        resolve(res)
      }).catch(err => console.error(err));


    })

  }

  logout() {
    this.firebaseAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    })
  }




}
