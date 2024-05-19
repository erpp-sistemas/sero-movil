import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EncuestaGeneral } from '../interfaces';
import { DblocalService } from '../services/dblocal.service';
import { getFecha } from '../../helpers'
import { LoadingController } from '@ionic/angular';
import { Storage } from "@ionic/storage";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { MessagesService } from '../services/messages.service';
import { RestService } from '../services/rest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-encuesta-general',
  templateUrl: './encuesta-general.page.html',
  styleUrls: ['./encuesta-general.page.scss'],
})
export class EncuestaGeneralPage implements OnInit {

  id_plaza: string
  id_encuesta: string;
  data: EncuestaGeneral[];
  title_encuesta: string = '';
  icon_encuesta: string = '';
  preguntas: any[];
  results = {}
  loading: any
  geoPosicion: any = {};
  latitud: number = 0;
  longitud: number = 0;
  colonia: string = ''

  constructor(
    private activeRoute: ActivatedRoute,
    private dblocal: DblocalService,
    private rest: RestService,
    private loadingController: LoadingController,
    private storage: Storage,
    private geolocation: Geolocation,
    private message: MessagesService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.id_plaza = this.activeRoute.snapshot.paramMap.get('id_plaza')
    this.id_encuesta = this.activeRoute.snapshot.paramMap.get('id_encuesta')
    this.getDataEncuestas()
  }

  async getDataEncuestas() {
    this.data = await this.dblocal.getDataEncuestas()
    // this.title_encuesta = this.data[0].name_encuesta
    // this.icon_encuesta = this.data[0].icono_app_movil
    this.setEncuesta()
  }

  setEncuesta() {
    const encuesta = this.data.filter(enc => enc.id_encuesta === Number(this.id_encuesta) && enc.id_plaza === Number(this.id_plaza))
    this.title_encuesta = encuesta[0].name_encuesta;
    this.icon_encuesta = encuesta[0].icono_app_movil;
    this.preguntas = encuesta.map(enc => {
      return {
        id_pregunta: enc.id_pregunta,
        name_pregunta: enc.name_pregunta,
        posibles_respuestas: enc.posibles_respuestas.split(',')
      }
    })
    console.log(this.preguntas)
  }


  async messageTerminarGestion() {

    await this.obtenerUbicacion()

    this.loading = await this.loadingController.create({
      message: 'Enviando encuesta...',
      spinner: 'dots'
    })

    await this.loading.present();

    const id_usuario = await this.storage.get('IdAspUser')
    const fecha_actual = getFecha()


    let data = {
      ...this.results,
      id_plaza: this.id_plaza,
      id_encuesta: this.id_encuesta,
      colonia: this.colonia,
      latitud: this.latitud,
      longitud: this.longitud,
      fecha_captura: fecha_actual,
      id_usuario: id_usuario
    }
    console.log(data)

    const total_preguntas = this.preguntas.length + 7
    if (Object.keys(data).length < total_preguntas || this.colonia === '') {
      this.message.showAlert("Todos las preguntas de la encuesta son obligatorias")
      this.loading.dismiss()
      return
    }


    try {
      const message = await this.rest.sendOneRegisterEncuesta(data)
      console.log(message)
      if (message === 'No se pudo enviar') {
        console.log("No se envio entonces vamos a guardarla")
        this.loading.dismiss()
        await this.saveLocal(data, fecha_actual)
      } else {
        this.loading.dismiss()
        this.exit()
      }
    } catch (error) {
      console.error(error)
      this.message.showToast(error)
      await this.saveLocal(data, fecha_actual)
      this.loading.dismiss()
    }



  }

  async saveLocal(data: any, fecha_actual: string) {
    
    this.loading = await this.loadingController.create({
      message: 'Guardando encuesta...',
      spinner: 'dots'
    })

    await this.loading.present();

    this.dblocal.insertRegisterEncuestaGeneral(data, fecha_actual).then((message: string) => {
      console.log(message)
      this.message.showToastLarge(message)
      this.loading.dismiss()
      this.clearFields()
      this.exit()
    }).catch(error => {
      this.message.showToastLarge(error)
      this.loading.dismiss();
    })
  }

  async obtenerUbicacion() {
    let loadingGeolocation = await this.loadingController.create({
      message: 'Obteniendo ubicación...',
      spinner: 'dots'
    });

    await loadingGeolocation.present();

    await this.getGeolocation();


    if (this.geoPosicion.coords) {
      this.latitud = this.geoPosicion.coords.latitude;
      this.longitud = this.geoPosicion.coords.longitude;
    } else {
      console.log("No se pudo obtener la geolocalización");
      this.latitud = 0;
      this.longitud = 0;
    }

    loadingGeolocation.dismiss();
  }

  async getGeolocation() {
    return new Promise(async (resolve, reject) => {
      try {
        setTimeout(() => {
          resolve(this.geoPosicion);
        }, 4000);
        this.geoPosicion = await this.geolocation.getCurrentPosition();
      } catch (error) {
        console.log(error);
        reject(error)
      }
    })
  }

  exit() {
    this.clearFields()
    this.router.navigateByUrl('encuestas-list')
  }

  clearFields() {
    this.results = {}
    this.geoPosicion = {};
    this.latitud = 0;
    this.longitud = 0;
    this.colonia = ''
  }

}
