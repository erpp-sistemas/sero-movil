import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthService } from '../services/auth.service';
import { MessagesService } from '../services/messages.service';
import { RestService } from '../services/rest.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  imgAvatar: string = '/assets/avatars/';
  nombre: string = '';
  email: string = '';
  plaza: string = '';
  progress: boolean = false;
  progressTotal: number = 0;
  loading:any;
  data:any;
  total:any;
  alert:any;

  constructor(
    private storage: Storage,
    private menuCtrl: MenuController,
    private auth: AuthService,
    private rest: RestService,
    private loadinCtrl: LoadingController,
    private message: MessagesService,
    private router:Router,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.mostrarAvatar();
    this.obtenerDatosUsuario();
  }

  async mostrarAvatar() {
    this.imgAvatar += await this.storage.get('ImgAvatar');
  }

  async obtenerDatosUsuario() {
    this.nombre = await this.storage.get('Nombre');
    this.email = await this.storage.get('Email');
    this.plaza = await this.storage.get('Plaza');
  }


  async confirmarDescarga(){
    const alert = await this.alertCtrl.create({
      subHeader:'Descarga',
      message: 'Confirme para iniciar descarga',
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
            //  if(this.network.getNetworkType() == 'wifi'){
            this.descargarInformacion();
          }
        }
      ]
    });
    await alert.present();
  }


  async descargarInformacion() {
 

    this.progress = true;
    this.deleteContribuyente();

    this.loading = await this.loadinCtrl.create({
      message: 'Descargando informaciòn...',
      spinner: 'dots'
    });

    await this.loading.present();
    // const idaspuser = await this.storage.get("IdAspUser");
    // const idplaza = await this.storage.get("IdPlaza");

    // borrar esto, solo es de pruebas
    const idplaza = '10';
    const idaspuser = '18a16d45-6334-4cca-aef7-47a0e837a5f8';

    try{
      this.data = await this.rest.obtenerDatosSql(idaspuser, idplaza);
      this.total = this.data.length;

      if (this.total == 0) {
        this.message.showAlert("No tienes cuentas para sincronizar");
        this.loading.dismiss();
        return;
      }
  
      this.storage.set("total", this.total);
  
      await this.guardarInfoSQL(this.data);
      
      // Aqui se guardaran las llaves en el storage para definir campos de validacion de modulos
  
      var dateDay = new Date().toISOString();
      let date: Date = new Date(dateDay);
      let ionicDate = new Date(
        Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds(),
        )
      );
  
      let fecha = ionicDate.toISOString();
      this.storage.set("FechaSync", fecha);
      this.loading.dismiss();
      this.message.showAlert("Se han descargado tus cuentas!!!!");
  
      this.router.navigateByUrl('/home/tab2');
    } catch(eror) {
      this.message.showAlert("Error al intentar la descarga");
    }
  }


  async guardarInfoSQL(data) {
    console.log("Guardando la informacion");
    let cont = 0;
    for (let i = 0; i < data.length; i++) {
      await this.rest.guardarInfoSQLContribuyente(data[i]);
      cont = cont + 1;
      this.progressTotal = cont / this.total;
    }
  }

  async deleteContribuyente() {
    await this.rest.deleteContribuyente();
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }


  exit() {
    this.auth.logout();
  }


}
