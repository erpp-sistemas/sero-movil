import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Router } from '@angular/router';
import { GoogleMaps, GoogleMap, Marker, GoogleMapsAnimation, MyLocation, GoogleMapOptions, GoogleMapsMapTypeId } from '@ionic-native/google-maps';
import { LoadingController, ToastController, Platform, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
import { RestService } from '../services/rest.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MessagesService } from '../services/messages.service';

declare var google;

@Component({
  selector: 'app-checador',
  templateUrl: './checador.page.html',
  styleUrls: ['./checador.page.scss'],
})
export class ChecadorPage implements OnInit {

  map: GoogleMap;
  loading: any;
  nombre: string;
  plaza: string
  idPlaza: string;
  email: string
  latitud: any;
  longitud: any;
  reloj: string
  map2: any;


  constructor(
    private router: Router,
    private callNumber: CallNumber,
    public alertController: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private platform: Platform,
    private storage: Storage,
    private rest: RestService,
    private modalController: ModalController,
    private geolocation: Geolocation,
    private message: MessagesService
  ) { }

  async ngOnInit() {
    await this.platform.ready();
    //await this.obtenerUbicacion();
    await this.loadMap();
  }

  // async obtenerUbicacion() {
  //   this.geolocation.getCurrentPosition().then(resp => {

  //     this.latitud = resp.coords.latitude;
  //     this.longitud = resp.coords.longitude;

  //     const map = new google.maps.Map(document.getElementById('map_canvas'), {
  //       center: {
  //         lat: this.latitud,
  //         lng: this.longitud
  //       },
  //       zoom: 12
  //     });

  //     const pos = {
  //       lat: this.latitud,
  //       lng: this.longitud
  //     };

  //     map.setCenter(pos);
  //     const icon = {
  //       url: 'assets/icon/user.png', // image url
  //       scaledSize: new google.maps.Size(50, 50), // scaled size
  //     };

  //     const marker = new google.maps.Marker({
  //       position: pos,
  //       map: map,
  //       title: 'Posición actual',
  //       icon: icon
  //     });

  //     const infowindow = new google.maps.InfoWindow({
  //       content: 'Hola',
  //       maxWidth: 400
  //     });
  //     marker.addListener('click', function () {
  //       infowindow.open(map, marker);
  //     });

  //   })
  // }


  async loadMap() {
    let options: GoogleMapOptions = {
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

    this.map = GoogleMaps.create('map_canvas', options);

    this.loading = await this.loadingCtrl.create({
      message: 'Cargando mapa'
    })

    await this.loading.present();

    this.map.getMyLocation().then((location: MyLocation) => {
      this.loading.dismiss();
      console.log(JSON.stringify(location, null, 2));
      this.latitud = location.latLng.lat.toString();
      this.longitud = location.latLng.lng.toString();

      this.map.animateCamera({
        target: location.latLng,
        zoom: 12,
        tilt: 30
      });
      let marker: Marker = this.map.addMarkerSync({
        title: 'Mi ubicación actual',
        position: location.latLng,
        animation: GoogleMapsAnimation.BOUNCE
      });
      marker.showInfoWindow();

    }).catch(err => {
      console.log("Hubo un error");
      this.loading.dismiss();
      this.showToast(err)
    })

  }

  async showToast(mensaje: string) {
    let toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  async confirmarRegistroEntrada() {
    this.loading = await this.loadingCtrl.create( {
      message: 'Registrando asistencia',
      spinner: 'dots'
    })
    await this.loading.present();

    setTimeout(() => {
      this.loading.dismiss();
      this.message.showAlert("Registro entrada correcto");
    },3000);
  }

  async confirmarRegistroSalida() {
    this.loading = await this.loadingCtrl.create( {
      message: 'Registrando salida',
      spinner: 'dots'
    })
    await this.loading.present();

    setTimeout(() => {
      this.loading.dismiss();
      this.message.showAlert("Registro salida correcto");
    },3000);
  }




  navegar(tipo) {
    if (tipo == 1) {
      this.router.navigateByUrl('home/tab1');
    } else if (tipo == 2) {
      this.router.navigateByUrl('home/tab2');
    } else if (tipo == 3) {
      this.router.navigateByUrl('home/tab3');
    } else if (tipo == 4) {
      this.router.navigateByUrl('home/tab4');
    } else if (tipo == 5) {

      this.callNumber.callNumber('18001010101', true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));

    }
  }

}
