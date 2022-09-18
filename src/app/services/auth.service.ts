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

//import { BehaviorSubject } from 'rxjs';

//http://201.163.165.20/sero/image/usuario/

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiObtenerServiciosUser = "https://ser0.mx/seroMovil.aspx?query=sp_obtener_servicios";
  apiObtenerServiciosPublicos = "https://ser0.mx/seroMovil.aspx?query=sp_obtener_servicios_publicos";
  apiObtenerEmpleadosPlaza = "https://ser0.mx/seroMovil.aspx?query=sp_obtener_gestores_plaza";
  apiUpdateAppVersion = "https://ser0.mx/seroMovil.aspx?query=sp_user_app_version";
  //private objectSource = new BehaviorSubject<[]>([]);
  //$getObjectSource = this.objectSource.asObservable();
  userInfo: any;
  modal: any;


  constructor(
    public firebaseAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private mensaje: MessagesService,
    private router: Router,
    private storage: Storage,
    private rest: RestService,
    private http: HttpClient,
    private modalCtrl: ModalController,
    private appVersion: AppVersion
  ) { }

  /** 
   * Especificaciones del servicio
   * Peticion a Firebase al metodo de autenticacion con el email y el password que nos paso el componente login
   * Obtener el uid de firebase del usuario
   * Obtener el documento de firebase de la coleccion usersErpp con el uid que se obtuvo anteriormente 
   * Verificar si esta activo el usuario
   * Verificar si IMEI = ''
    * Guardar en el storage la informacion obtenida del firebase
    * Obtener los servicios publicos para guardarlos en la base interna SQlite
    * Obtener los usuarios de la plazas a la que pertenece el usuario a loguearse para guardarlos en la base interna SQlite
    * Obtener la informacion de las plazas y los servicios de las plazas a las que pertenece el usuario a loguearse para despues insertarlas en la base interna SQlite
   * Si si tiene IMEI
    * Se valida el correo y el nombre en el storage con los ingresados para ver si es la misma persona que tenia la sesion anterior
    * Y se vuelven a generar los 4 metodos anteriores
    * Si no es el mismo usuario que el de la sesion anterior se borrara la informacion con el metodo deleteInfo
  */


  /**
   * Metodo que hace la peticion a firebase para la autenticacion
   * @param email 
   * @param password 
   * @returns Promise
   */
  loginFirebase(email: string, password: string) {

    return new Promise((resolve, reject) => {
      this.firebaseAuth.signInWithEmailAndPassword(email, password).then(user => {
        // creamos una variable que tendra el uid del usuario de firebase
        const id = user.user.uid;
        let createSubscribe = this.getUserInfo(id).subscribe(async userInfoFirebase => {
          // this.userInfo tiene la informacion del usuario del firebase
          if(!userInfoFirebase) {
            this.mensaje.showAlert("Usuario no creado en la app móvil");
            return;
          }
          this.userInfo = userInfoFirebase
          console.log("Usuario firebase: ", this.userInfo);
          // corroborar si el usuario esta activo
          if (this.userInfo.isActive) {
            if (this.userInfo.IMEI = '') {
              // usuario nuevo
              console.log("IMEI vacio");
              createSubscribe.unsubscribe();
              // guardar la informacion del usuario en el storage
              this.saveUserInfoStorage(this.userInfo);
              this.obtenerServiciosPublicos();
              this.obtenerUsuariosPlaza(this.userInfo);
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
                this.obtenerUsuariosPlaza(this.userInfo);
                this.getServicesPlazaUser(this.userInfo.idaspuser);
                this.generaIdentificativo(id);
                resolve(nombreUser)
              }
              else {
                console.log("Correo en el storage diferente al ingresado, puede ser null el correo en el storage");
                createSubscribe.unsubscribe();
                this.saveUserInfoStorage(this.userInfo);
                this.obtenerServiciosPublicos();
                this.obtenerUsuariosPlaza(this.userInfo);
                this.getServicesPlazaUser(this.userInfo.idaspuser);
                let nombreUsuario = await this.storage.get("Nombre")
                await this.storage.set("idFireBase", id)
                await this.storage.set("ActivateApp", "1");
                await this.storage.set("total", null);
                await this.storage.set("FechaSync", null);
                this.generaIdentificativo(id);
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

  /**
   * Metodo que inserta la informacion del usuario de sus plazas y servicios(agua, predio, antenas ...) de las plazas a las que pertenece
   * @param data 
   */
  insertarServicios(data) {
    data.forEach(servicio => {
      this.rest.insertarServiciosSQL(servicio);
    });
  }

  /**
   * Metodo que obtiene todos los servicios publicos de todas las plazas del SQL Server para despues insertarlos en la tabla 
   * interna SQlite listaServiciosPublicos
   */
  async obtenerServiciosPublicos() {
    console.log("obteniendo los servicios publicos");
    await this.rest.deleteServiciosPublicos();
    this.http.get(this.apiObtenerServiciosPublicos).subscribe(data => {
      this.insertarServiciosPublicos(data);
    })

  }

  /**
   * Metodo que pide al SQL Server los usuarios de las plazas a la que pertenece el usuario a loguearse, para despues insertarlos en la 
   * tabla interna SQlite empleadosPlaza
   * @param userInfo 
   */
  async obtenerUsuariosPlaza(userInfo) {
    console.log("Obteniendo los empleados de la plaza");
    await this.rest.deleteEmpleadosPlaza();
    // obtener el id del usuario para mandarlo a la api
    let idAspUser = userInfo.idaspuser;
    console.log(idAspUser);
    this.http.get(this.apiObtenerEmpleadosPlaza + " '" + idAspUser + "'").subscribe(data => {
      console.log(data);
      this.insertaEmpleadosPlaza(data);
    })
  }

  /**
   * Inserta en la tabla interna SQlite listaServiciosPublicos la informacion de los servicios publicos de todas las plazas 
   * que se recibieron del SQL Server 
   * @param data 
   */
  insertarServiciosPublicos(data) {
    data.forEach(servicio => {
      this.rest.insertarServicioPublicoSQL(servicio);
    });
  }

  /**
   * Inserta en la tabla interna SQlite empleadosPlaza los usuarios de las plazas a la que pertenece el usuario a loguearse
   * que se recibieron del SQL Server
   * @param empleados 
   */
  insertaEmpleadosPlaza(empleados) {
    empleados.forEach(empleado => {
      this.rest.insertaEmpleadosPlaza(empleado);
    });
  }


  /**
   * Metodo que guarda en el storage los campos del usuario con la informacion obtenida de firebase
   * estos campos ya necesitan estar en firebase al momento de crear el usuario
   * @param userInfo (Infotmacion de firebase del usuario que se intenta loguear)
   */
  saveUserInfoStorage(userInfo: any) {
    this.storage.set('Nombre', userInfo.name);
    this.storage.set('Email', userInfo.email);
    this.storage.set('IdAspUser', userInfo.idaspuser)
    this.storage.set('Password', userInfo.password)
    
  }

  /**
   * Metodo que genera el identificatvo tomando el idFirebase(uid)
   * @param id 
   */
  generaIdentificativo(id) {
    this.saveDataCell(id);
  }

  /**
   * Metodo que actualiza el documento del usuario en firebase de los campos IMEI y lastSession vez que inicio sesion
   * @param id 
   */
  async saveDataCell(id) {
    console.log("Generando identificativo");
    let name = await this.storage.get("Nombre");
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
        console.log(data);
      })
    } catch (error) {
      console.log("No se pudo actualizar la version de la app en el SQL ", error);
    }
  }

  /**
   * Metodo para registrar un usuario, ahorita no se ocupa ya que el usuario se creara desde la web
   * @param email 
   * @param password 
   * @param name 
   * @param idplaza 
   * @param idrol 
   * @param idaspuser 
   * @param rol 
   * @param plaza 
   * @param idUserChecador 
   * @param imgAvatar 
   * @returns Promise
   */
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

  /**
   * Metodo para cerrar sesion
   */
  logout() {
    this.firebaseAuth.signOut().then(async () => {
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


}
