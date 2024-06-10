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
  results_sub = {}
  loading: any
  geoPosicion: any = {};
  latitud: number = 0;
  longitud: number = 0;
  colonia: string = ''
  contador_encuestas: any
  edad: number = 0;
  sexo: string = ''

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

  ionViewDidEnter() {
    this.getTotalEncuestas();
  }

  async getDataEncuestas() {
    this.data = await this.dblocal.getDataEncuestas()
    //console.log(this.data)
    this.setEncuesta()
  }

  async getTotalEncuestas() {
    const fecha = this.getCurrentDate()
    const res = await this.dblocal.getContadorRegisterEncuesta(fecha)
    console.log(res)
    this.contador_encuestas = res[0].total
  }

  getCurrentDate() {
    const today = new Date();
    let currentDate: any
    // Formatear la fecha como una cadena (puedes ajustar el formato según tus necesidades)
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
    currentDate = today.toLocaleDateString('es-ES', options);
    return currentDate
  }

  setEncuesta() {
    const encuesta = this.data.filter(enc => enc.id_encuesta === Number(this.id_encuesta) && enc.id_plaza === Number(this.id_plaza))
    this.title_encuesta = encuesta[0].name_encuesta;
    this.icon_encuesta = encuesta[0].icono_app_movil;
    this.preguntas = encuesta.map(enc => {
      return {
        id_pregunta: enc.id_pregunta,
        name_pregunta: enc.name_pregunta,
        posibles_respuestas: enc.posibles_respuestas.split(','),
        id_sub_pregunta: enc.id_sub_pregunta,
        name_sub_pregunta: enc.name_sub_pregunta,
        sub_pregunta_posibles_respuestas: enc.sub_pregunta_posibles_respuestas.split(',')
      }
    })
    //console.log(this.preguntas)
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
      sub_preguntas: this.results_sub,
      id_plaza: this.id_plaza,
      id_encuesta: this.id_encuesta,
      colonia: this.colonia,
      edad: this.edad,
      sexo: this.sexo,
      latitud: this.latitud,
      longitud: this.longitud,
      fecha_captura: fecha_actual,
      id_usuario: id_usuario
    }
    //console.log(data)

    const total_preguntas = this.preguntas.length + 9
    if (Object.keys(data).length < total_preguntas || this.colonia === '' || this.edad === 0 || this.sexo === '') {
      this.message.showAlert("Todos las preguntas de la encuesta son obligatorias")
      this.loading.dismiss()
      return
    }


    try {
      const message = await this.rest.sendOneRegisterEncuesta(data)
      console.log(message)
      if (message === 'No se pudo enviar') {
        //console.log("No se envio entonces vamos a guardarla")
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

  noContest() {
    
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
