import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { GoogleMaps, GoogleMap, Marker, GoogleMapsAnimation, MyLocation, GoogleMapOptions, GoogleMapsMapTypeId, MarkerIcon } from '@ionic-native/google-maps';
import { SuperviceGestorPage } from '../supervice-gestor/supervice-gestor.page';
import { DblocalService } from '../services/dblocal.service';
import { Gestor } from '../interfaces';
import { RestService } from '../services/rest.service';


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
  gestores: Gestor[];
  gestores_position: any[];

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
    private dbLocalService: DblocalService,
    private rest: RestService
  ) { }

  async ngOnInit() {
    await this.platform.ready();
    if(!this.showForm) await this.loadMap();
    await this.getGestoresLocal();
  }

  async loadMap() {
    this.map = GoogleMaps.create('map_canvas', this.options);
    this.loading = await this.loadingController.create({
      message: 'Cargando mapa...'
    });
    await this.loading.present();

    const gestores_photo = await this.rest.getLastPositionGestor();
    for (let g of gestores_photo) {
      this.addMarker(g)
    }

    this.map.getMyLocation().then(async (location: MyLocation) => {
      this.loading.dismiss();
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
  
      this.map.addMarkerSync({
        title: `${data.nombre} ${data.apellido_paterno} ${data.apellido_materno}`,
        position: { lat: data.latitud, lng: data.longitud },
        icon: icon_gestor
      });
    });
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
        gestores: this.gestores
      }
    })
    await modal.present();

    const res = await modal.onDidDismiss();
    if (res.data.status) {
      this.showForm = true;
    }
  }

  async getGestoresLocal() {
    const data_gestores = await this.dbLocalService.getGestores();
    this.gestores = data_gestores;
  }

}
