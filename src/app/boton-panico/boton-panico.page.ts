import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { RestService } from '../services/rest.service';
import { UsuarioAyuda } from '../interfaces/UsuarioAyuda'
import { SMS } from '@awesome-cordova-plugins/sms/ngx';

@Component({
  selector: 'app-boton-panico',
  templateUrl: './boton-panico.page.html',
  styleUrls: ['./boton-panico.page.scss'],
})
export class BotonPanicoPage implements OnInit {

  id_usuario: any;
  fechaCaptura: any;
  latitud: number;
  longitud: number;
  loading: any

  usuariosAyuda: UsuarioAyuda[] = []

  constructor(
    private loadingController: LoadingController,
    private geolocation: Geolocation,
    private storage: Storage,
    private rest: RestService,
    private sms: SMS
  ) { }

  async ngOnInit() {
    await this.obtenerUsuario();
  }

  ionViewWillLeave() {
    console.log("saliendo");
    this.usuariosAyuda = [];
  }

  async confirmarBoton() {
    console.log("Obtener geolocalizacion y madar mensaje de texto");

    this.loading = await this.loadingController.create({
      message: 'Mandando petición de ayuda!!!!'
    });

    await this.loading.present();

    var dateDay = new Date().toISOString();
    let date: Date = new Date(dateDay);
    let ionicDate = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      )
    );
    this.fechaCaptura = ionicDate.toISOString();
    await this.obtenerGeolocalizacion();
  }

  async obtenerGeolocalizacion() {

    this.geolocation.getCurrentPosition().then(async (resp) => {

      if (resp) {
        this.latitud = resp.coords.latitude;
        this.longitud = resp.coords.longitude;

        await this.mandarInformacion();

        this.loading.dismiss();
      } else {
        this.loading.dismiss();
      }


    });

  }

  async obtenerUsuario() {
    this.id_usuario = await this.storage.get('IdAspUser');
  }

  async mandarInformacion() {
    let data = {
      id_usuario: this.id_usuario,
      fecha_captura: this.fechaCaptura,
      latitud: this.latitud,
      longitud: this.longitud
    }
    this.usuariosAyuda = await this.rest.registroBotonPanico(data)
    console.log(this.usuariosAyuda);
    this.enviarMensajes();
  }


  enviarMensajes() {
    this.sms.hasPermission().then(data => {
      if (data) {
        this.sms.send('5527112322', 'hola').then(mensaje => {
          console.log(mensaje);
        })
      } else {
        console.log(data);
      }
    })
  }

}
