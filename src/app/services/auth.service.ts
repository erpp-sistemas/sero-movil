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

//import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiObtenerServiciosUser = "http://201.163.165.20/seroMovil.aspx?query=sp_obtener_servicios";
  apiObtenerServiciosPublicos = "http://201.163.165.20/seroMovil.aspx?query=sp_obtener_servicios_publicos";
  //private objectSource = new BehaviorSubject<[]>([]);
  //$getObjectSource = this.objectSource.asObservable();
  userInfo: any;
  modal:any;


  constructor(
    public firebaseAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private mensaje: MessagesService,
    private router: Router,
    private storage: Storage,
    private rest: RestService,
    private http: HttpClient,
    private modalCtrl: ModalController
  ) { }


  loginFirebase(email: string, password: string) {

    return new Promise((resolve, reject) => {
      this.firebaseAuth.signInWithEmailAndPassword(email, password).then(user => {
        const id = user.user.uid;
        let createSubscribe = this.getUserInfo(id).subscribe(async userInfoFirebase => {
          // this.userInfo tiene la informacion del usuario del firebase
          this.userInfo = userInfoFirebase
          console.log("Usuario firebase: " , userInfoFirebase);
          // corroborar si el usuario esta activo
          if (this.userInfo.isActive) {
            if (this.userInfo.IMEI = '') {
              // usuario nuevo
              createSubscribe.unsubscribe();
              // guardar la informacion del usuario en el storage
              this.saveUserInfoStorage(this.userInfo);
              this.obtenerServiciosPublicos();
              this.getServicesPlazaUser(this.userInfo.idaspuser);
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
                this.obtenerServiciosPublicos();
                this.getServicesPlazaUser(this.userInfo.idaspuser);
                resolve(nombreUser)
              }
              else {
                console.log("Correo en el storage diferente al ingresado, puede ser null el correo en el storage");
                createSubscribe.unsubscribe();
                this.saveUserInfoStorage(this.userInfo);
                this.obtenerServiciosPublicos();
                this.getServicesPlazaUser(this.userInfo.idaspuser);
                let nombreUsuario = await this.storage.get("Nombre")
                await this.storage.set("idFireBase", id)
                await this.storage.set("ActivateApp", "1");
                await this.storage.set("total", null);
                await this.storage.set("FechaSync", null);
                this.rest.deleteInfo();
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

  /**
   * Metodo que trae la informacion del documento de la coleccion usersErpp por uid 
   * @param uid 
   * @returns documento de collection usersErpp
   */
  getUserInfo(uid: string) {
    return this.firestore.collection('usersErpp').doc(uid).valueChanges()
  }

  /**
   * Metodo que manda a traer la informacion del usuario sus plazas y sus servicios de las plazas
   * @param idUser 
   */
  async getServicesPlazaUser(idUser) {
    console.log("GetServicesPlazaUser");
    console.log("idaspuser: " + idUser);
    await this.rest.deleteServicios();
    this.http.get(this.apiObtenerServiciosUser + " " + idUser).subscribe(data => {
      console.log("Servicios", data);
      this.insertarServicios(data);
    })
    
  }

  insertarServicios( data ) {
    data.forEach(servicio => {
        this.rest.insertarServiciosSQL(servicio);
    });
  }

  async obtenerServiciosPublicos() {
    console.log("obteniendo los servicios publicos");
    await this.rest.deleteServiciosPublicos();
    this.http.get(this.apiObtenerServiciosPublicos).subscribe(data => {
      console.log(data);
      this.insertarServiciosPublicos(data);
    })

  }

  insertarServiciosPublicos(data) {
    data.forEach(servicio => {
      this.rest.insertarServicioPublicoSQL(servicio);
    });
  }

  

  // async getPlazaInfo() {
  //   const idplaza = await this.storage.get('IdPlaza');

  //   return new Promise( (resolve, reject ) => {
  //     const sectores = [
  //       {
  //         id_plaza: 1,
  //         nombre: 'Leon Guanajuato',
  //         id_sector: 1,
  //         nombre_sector: 'agua'
  //       },
  //       {
  //         id_plaza: 1,
  //         nombre: 'Leon Guanajuato',
  //         id_sector: 2,
  //         nombre_sector: 'predio'
  //       },
  //       {
  //         id_plaza: 1,
  //         nombre: 'Leon Guanajuato',
  //         id_sector: 4,
  //         nombre_sector: 'antenas'
  //       }
  //     ]
  //     resolve(sectores);
  //   })
    
  //   // return new Promise( resolve => {
  //   //   this.http.get(this.apiUrlSectoresPlazas + ' ' + idplaza).subscribe( data => {
  //   //     console.log(data);
  //   //     resolve(data)
  //   //   })
  //   // });

  // }

  saveUserInfoStorage(userInfo: any) {
    this.storage.set('Nombre', userInfo.name);
    this.storage.set('Email', userInfo.email);
    this.storage.set('IdAspUser', userInfo.idaspuser)
    this.storage.set('IdRol', userInfo.idrol);
    this.storage.set('Rol', userInfo.rol);
    this.storage.set('IdUserChecador', userInfo.idUserChecador)
    this.storage.set('Password', userInfo.password)
    this.storage.set('ImgAvatar', userInfo.imgAvatar);
    this.storage.set('NumeroPlazas', userInfo.plaza.length);
    let contadorPlaza = 1;
    let contadorIdPlaza = 1;
    console.log(userInfo.plaza);
    userInfo.plaza.forEach(plaza => {
      console.log("Plaza:", plaza);
      this.storage.set(`nombre${contadorPlaza}`, plaza);
      console.log(`nombre${contadorPlaza}`);
      contadorPlaza++;
    });

    userInfo.idPlaza.forEach(idPlaza => {
      console.log("idPlaza:", idPlaza);
      this.storage.set(`idPlaza${contadorIdPlaza}`, idPlaza);
      console.log(`idPlaza${contadorIdPlaza}`);
      contadorIdPlaza++;
    });    

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
    this.firebaseAuth.signOut().then( async () => {
      // this.router.navigate(['/login']);
      
      this.modal = await this.modalCtrl.create({
        component: LoginPage
      });
  
      this.modal.present()
  
      this.modal.onDidDismiss().then(data => {
        this.router.navigate(['home/tab1']);
      })
    })
  }

  // sendObjectSource(data:any) {
  //   this.objectSource.next(data);
  // }


}
