import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { GoogleMaps, GoogleMap, Marker, MyLocation, GoogleMapOptions, GoogleMapsMapTypeId, MarkerIcon } from '@ionic-native/google-maps';
import { SuperviceGestorPage } from '../supervice-gestor/supervice-gestor.page';
import { Gestor } from '../interfaces';
import { RestService } from '../services/rest.service';
import { WebsocketService } from '../services/websocket.service';
import { ChartCoordinatorPage } from '../chart-coordinator/chart-coordinator.page';
import { Storage } from '@ionic/storage';
import { MessagesService } from '../services/messages.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-coordinator',
  templateUrl: './coordinator.page.html',
  styleUrls: ['./coordinator.page.scss'],
})
export class CoordinatorPage implements OnInit {

  showForm: boolean = false;
  map: GoogleMap;
  loading: any;
  latitud: any;
  longitud: any;
  id_plaza: number;
  gestores: Gestor[];
  gestores_position: any[];

  gestor: Gestor;
  messages: any[] = [];
  markers: { [userId: string]: Marker } = {};



  options: GoogleMapOptions = {
    mapType: GoogleMapsMapTypeId.ROADMAP,
    controls: {
      'compass': true,
      'myLocationButton': true,
      'myLocation': true,
      'mapToolbar': true
    },
    gestures: {
      scroll: true,
      tilt: true,
      zoom: true,
      rotate: true
    }
  }

  constructor(
    private platform: Platform,
    private loadingController: LoadingController,
    public toastCtrl: ToastController,
    private modalController: ModalController,
    private rest: RestService,
    private wssService: WebsocketService,
    private storage: Storage,
    private messageService: MessagesService,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.platform.ready();
    this.id_plaza = await this.storage.get('IdPlazaActiva');

    if (!this.showForm) await this.loadMap();

    this.wssService.getMessages().subscribe((message) => {
      if (message) {
        console.log(message);
        this.messages.push(message);
        this.updateMarkerPosition(message.payload.data)
      }
    })
  }

  async loadMap() {
    this.map = GoogleMaps.create('map_canvas', this.options);
    this.loading = await this.loadingController.create({
      message: 'Cargando mapa...'
    });
    await this.loading.present();
    this.gestores = await this.rest.getLastPositionGestor(this.id_plaza);
    if (this.gestores.length === 0) {
      this.loading.dismiss();
      this.messageService.showAlert("No hay usuarios para esta plaza")
      this.router.navigateByUrl('/home/tab1');
    }
    for (let g of this.gestores) {
      this.addMarker(g)
    }
    this.loading.dismiss();
    this.map.getMyLocation().then(async (location: MyLocation) => {
      this.latitud = location.latLng.lat.toString();
      this.longitud = location.latLng.lng.toString();
      this.map.animateCamera({
        target: location.latLng,
        zoom: 12,
        tilt: 30
      });
    }).catch(err => {
      this.loading.dismiss();
      this.showToast(err.error_message);
    })

  }

  addMarker(data: any) {
    this.createCustomIcon(data.foto, (iconUrl: string) => {
      let icon_gestor: MarkerIcon = {
        url: iconUrl,
        size: { width: 60, height: 60 },
      };

      const marker = this.map.addMarkerSync({
        title: `${data.nombre} ${data.apellido_paterno} ${data.apellido_materno}`,
        position: { lat: data.latitud, lng: data.longitud },
        icon: icon_gestor
      });

      this.markers[data.id_usuario] = marker;
    });
  }

  updateMarkerPosition(updatedUser: any) {
    const marker = this.markers[updatedUser.id_usuario];
    if (marker) {
      marker.setPosition({ lat: updatedUser.latitud, lng: updatedUser.longitud });

      // Si la foto cambia entonces esto
      // this.createCustomIcon(updatedUser.photo, (iconUrl: string) => {
      //   marker.setIcon({
      //     url: iconUrl,
      //     size: { width: 60, height: 60 },
      //   });
      // });
    } else {
      // Si no existe el marcador, crear uno nuevo
      this.addMarker(updatedUser);
    }
  }

  createCustomIcon(url: string, callback: (iconUrl: string) => void) {
    const canvas = document.createElement('canvas');
    canvas.width = 50;
    canvas.height = 50;
    const context = canvas.getContext('2d');

    context.beginPath();
    context.arc(20, 20, 20, 0, Math.PI * 2, true);
    context.closePath();
    context.fillStyle = '#ffffff';
    context.fill();

    context.lineWidth = 2;
    context.strokeStyle = '#00FF00';
    context.stroke();

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      context.save();
      context.beginPath();
      context.arc(20, 20, 18, 0, Math.PI * 2, true);
      context.closePath();
      context.clip();
      context.drawImage(img, 0, 0, 40, 40);
      context.restore();

      const iconUrl = canvas.toDataURL('image/png');
      callback(iconUrl);
    };
    img.src = url;
  }



  async showToast(message: string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  async goForm() {
    const modal = await this.modalController.create({
      component: SuperviceGestorPage,
      cssClass: 'my-custom-class',
      componentProps: {
        gestores: this.gestores,
      }
    })
    await modal.present();

    const res = await modal.onDidDismiss();
    if (res.data.status) {
      this.gestor = res.data.gestor;
      this.showForm = true;
    }
  }

  async goChart() {

    const modal = await this.modalController.create({
      component: ChartCoordinatorPage,
      cssClass: 'my-custom-class'
    })

    await modal.present();

  }

}
