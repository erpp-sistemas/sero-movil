import { Component, OnInit } from '@angular/core';
import { Storage } from "@ionic/storage";
import { MessagesService } from '../services/messages.service';
import { ModalController, AlertController, Platform, LoadingController } from '@ionic/angular';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { RestService } from '../services/rest.service';

@Component({
  selector: 'app-gestion-inspeccion-agua',
  templateUrl: './gestion-inspeccion-agua.page.html',
  styleUrls: ['./gestion-inspeccion-agua.page.scss'],
})
export class GestionInspeccionAguaPage implements OnInit {

  account: string = "";
  cuentaCapturada: string = '';
  clave: string = '';
  ordenInspeccion: string = '';
  numeroMedidor: string = ''
  idTipoServicio: number = 0
  pozoConagua: string = '';
  idTipoHallazgo: number = 0;
  otroHallazgo: string = ''
  observacion: string = '';
  imgs: any;
  nombreInspectores = []; // donde se guardaran todos los inspectores de la plaza
  nombreInspectorLogueado: string = '';
  inspector2: string = '';
  inspector3: string = '';
  inspector4: string = '';
  tipoServicioPadron: string = '';

  latitud: number;
  longitud: number;
  fechaCaptura: string = "";
  idAspuser: string = "";
  idTareaGestor: number = 0;
  fechaActual: string;
  g: any;
  t: any;
  infoAccount: any[];
  image: string = "";
  isPhoto: boolean = false;
  isMotive: boolean = false;
  tareaAsignada: string;
  idAccountSqlite: number;
  loading: any;
  userInfo: any;
  indicadorImagen: number = 0;
  infoImage: any[];


  constructor(
    private storage: Storage,
    private mensaje: MessagesService,
    private geolocation: Geolocation,
    private modalController: ModalController,
    private platform: Platform,
    private alertController: AlertController,
    private loadingController: LoadingController,
    rest: RestService
  ) { 
    this.imgs = [{imagen:"assets/img/imgs.png"}];
  }

  ngOnInit() {
  }




}
