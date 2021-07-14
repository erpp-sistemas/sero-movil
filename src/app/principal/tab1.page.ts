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
  dataPozos:any;
  total:any;
  alert:any;
  totalPozos:any;
  dataSectores: any;
  // sectores validaciones
  agua: boolean;
  predio: boolean;
  antenas: boolean;
  pozos: boolean;
 
  // validaciones para saber si ya se han descargado cuentas
  descargaAgua: boolean;
  descargaPredio: boolean;
  descargaAntenas: boolean;
  descargaPozos: boolean;

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

  async ngOnInit() {
    this.mostrarAvatar();
    this.obtenerDatosUsuario();
    this.validaDescargas();
  }

  ionViewDidEnter() {
    this.asignarSectores();
  }

  async validaDescargas() {
    this.descargaAgua = await this.storage.get('DescargaAgua');
  }


  async asignarSectores() {

    this.dataSectores = await this.auth.getPlazaInfo();
    console.log("Data sectores: ", this.dataSectores);
    this.dataSectores.forEach( sector => {
      if(sector.nombre_sector == 'agua') {
        this.agua = true;
      } else if(sector.nombre_sector == 'predio') {
        this.predio = true;
      } else if(sector.nombre_sector == 'antenas') {
        this.antenas = true;
      } else if(sector.nombre_sector == 'pozos') {
        this.pozos = true;
      }
    });
  }


  async mostrarAvatar() {
    this.imgAvatar += await this.storage.get('ImgAvatar');
  }

  async obtenerDatosUsuario() {
    this.nombre = await this.storage.get('Nombre');
    this.email = await this.storage.get('Email');
    this.plaza = await this.storage.get('Plaza');
  }


  async confirmarDescarga( tipo ){

    if (tipo == 1) {
      console.log("Descargar agua");
      this.confirmaDescargaAgua()
    } else if ( tipo == 2) {
      console.log("Descarga predio");
      // llamar al metodo confirme la descarga de predio
    } else if (tipo == 3) {
      console.log("Descarga pozos");
      // llamar al metodo confirme la descarga de pozos
    } else if (tipo == 4) {
      console.log("Descarga antenas");
      // llamar al metodo confirme la descarga de antenas
    }
  }

  async confirmaDescargaAgua() {
    const alert = await this.alertCtrl.create({
      subHeader:'Descarga de cuentas de agua',
      message: 'Confirme para iniciar la descarga',
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
            this.descargarInformacionAgua();
          }
        }
      ]
    });
    await alert.present(); 
  }


  async confirmarDescargaPozos(){
    const alert = await this.alertCtrl.create({
      subHeader:'Descarga de datos de Pozos',
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
            this.descargarInfoPozos();
          }
        }
      ]
    });
    await alert.present();
  }

  async confirmarDescargaPredio(){
    const alert = await this.alertCtrl.create({
      subHeader:'Descarga de cuentas de predio',
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
            this.descargarInfoPredio();
          }
        }
      ]
    });
    await alert.present();
  }


  async descargarInformacionAgua() {
 
    this.progress = true;
    this.deleteInfoAgua();

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
      this.data = await this.rest.obtenerDatosSqlAgua(idaspuser, idplaza);
      this.total = this.data.length;

      if (this.total == 0) {
        this.message.showAlert("No tienes cuentas para sincronizar");
        this.loading.dismiss();
        return;
      }
  
      this.storage.set("total", this.total);
  
      await this.guardarDatosSQLAgua(this.data);
      
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
      await this.storage.set('DescargaAgua', true);
      this.descargaAgua = true;
      this.message.showAlert("Se han descargado tus cuentas!!!!");
      //this.router.navigateByUrl('/home/tab2');
    } catch(eror) {
      this.message.showAlert("Error al intentar la descarga");
    }
  }


  async guardarDatosSQLAgua(data) {
    console.log("Guardando la informacion de agua");
    let cont = 0;
    for (let i = 0; i < data.length; i++) {
      await this.rest.guardarInfoSQLAgua(data[i]);
      cont = cont + 1;
      this.progressTotal = cont / this.total;
    }
  }


  async descargarInfoPozos() {
    this.deleteInfoPozos();
    const idPlaza = await this.storage.get('IdPlaza');
    this.loading = await this.loadinCtrl.create({
      message: 'Descargando informaciòn de pozos...',
      spinner: 'bubbles'
    });

    await this.loading.present();

    try{
      this.dataPozos = await this.rest.obtenerDatosPozos(idPlaza);
      this.totalPozos = this.dataPozos.length;
      if (this.totalPozos == 0) {
        this.message.showAlert("No hay resultados, descargar datos de pozos");
        this.loading.dismiss();
        return;
      }

      await this.guardarDatosPozos(this.dataPozos);

      this.loading.dismiss();
      this.message.showAlert("Se han descargado tu informaciòn de pozos!!!!");
  
      this.router.navigateByUrl('/home/tab3');
    } catch( error){

    }


  }

  async guardarDatosPozos( data ) {
    for (let i = 0; i < data.length; i++) {
      await this.rest.guardarInfoSqlPozos(data[i]);
    }
  }


  descargarInfoPredio() {

  }

  async guardarDatosSQLPredio( data ) {

  }

  descargaInfoAntenas() {

  }

  async guardarDatosSQLAntenas( data ) {

  }


  async deleteInfoAgua() {
    await this.rest.deleteTableAgua();
  }

  async deleteInfoPozos() {
    await this.rest.deleteTablePozos();
  }

  async deleteInfoPredio() {

  }

  async deleteInfoAntenas() {

  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }


  exit() {
    this.auth.logout();
  }


  checador() {

  }

  listadoCuentas() {

  }


  manualWeb() {
    
  }


}
