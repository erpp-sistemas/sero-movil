import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { RestService } from '../services/rest.service';
import { UsuarioAyuda } from '../interfaces/UsuarioAyuda'
import { SMS } from '@awesome-cordova-plugins/sms/ngx';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-boton-panico',
  templateUrl: './boton-panico.page.html',
  styleUrls: ['./boton-panico.page.scss'],
})
export class BotonPanicoPage implements OnInit {

  id_usuario: any;
  nombre: string;
  fechaCaptura: any;
  latitud: number;
  longitud: number;
  loading: any
  error: boolean;

  usuariosAyuda: UsuarioAyuda[] = [];

  codigoPais: string = '+521'
  mensajeEnviado: boolean = false;



  usuarios: UsuarioAyuda[] = [
    {
      apellido_materno: "Nava",
      apellido_paterno: "Perez",
      distancia: 48473.293960164956,
      id_usuario: 9,
      latitud: 19.628384,
      longitud: -99.206668,
      nombre: "Guadalupe ",
      telefono_personal: "5527112322",
      fecha_captura: ''
    },
    {
      apellido_materno: "Lopez",
      apellido_paterno: "Ticante",
      distancia: 48473.293960164956,
      id_usuario: 54,
      latitud: 19.628384,
      longitud: -99.206668,
      nombre: "Ezequiel",
      telefono_personal: "5568982899",
      fecha_captura: ''
    },
  ]

  constructor(
    private loadingController: LoadingController,
    private geolocation: Geolocation,
    private storage: Storage,
    private rest: RestService,
    private sms: SMS,
    private message: MessagesService
  ) { }

  async ngOnInit() {
    await this.obtenerUsuario();
  }

  ionViewWillLeave() {
    this.usuariosAyuda = [];
    this.mensajeEnviado = false;
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
      } else {
        this.loading.dismiss();
      }
    });

  }

  async obtenerUsuario() {
    this.id_usuario = await this.storage.get('IdAspUser');
    this.nombre = await this.storage.get('Nombre');
  }

  async mandarInformacion() {
    let data = {
      id_usuario: this.id_usuario,
      fecha_captura: this.fechaCaptura,
      latitud: this.latitud,
      longitud: this.longitud
    }

    this.usuariosAyuda = await this.rest.registroBotonPanico(data);

    console.log(this.usuariosAyuda);

    this.usuariosAyuda.forEach(async usuario => {
      const numero = '+521' + usuario.telefono_personal
      let mensajeEstatus = await this.enviarMensaje(numero, usuario.nombre, usuario.apellido_paterno);
      if (mensajeEstatus === 'Mensaje enviado') {
        this.mensajeEnviado = true;
        this.error = false;
      } else {
        this.error = true
        this.mensajeEnviado = false;
      }
    });
    this.loading.dismiss();

  }


  async enviarMensaje(numero: string, nombre: string, apellido_paterno: string) {
    return new Promise(async (resolve, reject) => {

      let permiso = await this.sms.hasPermission();

      if (!permiso) {
        this.message.showToast("Activa el permiso para mandar mensajes sms");
        return;
      }

      try {
        this.sms.send(numero, `Hola ${nombre} ${apellido_paterno} soy ${this.nombre} y necesito ayuda, mi ubicacion es https://www.google.com/maps/place/${this.latitud},${this.longitud} `, { replaceLineBreaks: true }).then(result => {
          if (result === 'OK') {
            resolve("Mensaje enviado")
          }
        })
      } catch (error) {
        reject(error)
      }

    })

  }




}
