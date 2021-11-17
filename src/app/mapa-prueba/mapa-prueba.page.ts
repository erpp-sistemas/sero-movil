import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController, Platform } from '@ionic/angular';
import { MessagesService } from '../services/messages.service';
import { RestService } from '../services/rest.service';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Storage } from '@ionic/storage';

interface WayPoint {
  location: {
    lat: number,
    lng: number,
  };
  stopover: boolean;
}

declare var google;
@Component({
  selector: 'app-mapa-prueba',
  templateUrl: './mapa-prueba.page.html',
  styleUrls: ['./mapa-prueba.page.scss'],
})
export class MapaPruebaPage implements OnInit {

  latitud = 19.261870;
  longitud = -98.895795;
  map: any;
  markersArrayInfo: any;
  loading: any;
  idServicioPlaza: any;
  id_plaza: any;
  infoWindows: any = [];
  cuentasDistancia: any;
  positionActual: any;
  accountString: string = '';
  result: any[];

  wayPoints: WayPoint[] = [];


  constructor(
    private geolocation: Geolocation,
    private rest: RestService,
    private mensaje: MessagesService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private activeRoute: ActivatedRoute,
    private callNumber: CallNumber,
    private storage: Storage
  ) { }

  mapStyle =
    [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
    ]

  async ngOnInit() {
    await this.platform.ready();
    console.log(this.activeRoute.snapshot.paramMap.get('id'));
    console.log(this.activeRoute.snapshot.paramMap.get('id_plaza'));
    this.idServicioPlaza = this.activeRoute.snapshot.paramMap.get('id');
    this.id_plaza = this.activeRoute.snapshot.paramMap.get('id_plaza');
    await this.getAccountInfo(this.id_plaza, this.idServicioPlaza);
  }

  isNight() {
    //Returns true if the time is between
    //7pm to 5am
    let time = new Date().getHours();
    return (time > 5 && time < 19) ? false : true;
  }



  async getAccountInfo(id_plaza, idServicioPlaza) {//realiza la carga de informacion que existe en la base interna sqlite

    console.log("GetAccountInfo");
    this.markersArrayInfo = await this.rest.getDataVisitPosition(id_plaza, idServicioPlaza);
    console.log(this.markersArrayInfo);
    if (this.markersArrayInfo.length <= 0) {
      // await this.setMarkers(this.markersArrayInfo);  
      this.mensaje.showAlert('Tienes que descargar información para visualizar las cuentas en el mapa!!!!')
      this.router.navigateByUrl('/home');
      // this.toggleMenu();
    } else {
      this.loading = await this.loadingCtrl.create({
        message: 'Cargando cuentas en el mapa...'
      });
      await this.loading.present();

      await this.setMarkers(this.markersArrayInfo);
    }

  }

  async setMarkers(data) {
    let array = [];
    for (let markers of data) {
      let latlng = new google.maps.LatLng(parseFloat(markers.latitud), parseFloat(markers.longitud));
      let marker = {
        position: latlng,
        cuenta: markers.cuenta,
        propietario: markers.propietario,
        deuda: markers.total
      }

      array.push(marker);

      this.wayPoints.push({
        location: {
          lat: parseFloat(markers.latitud),
          lng: parseFloat(markers.longitud)
        },
        stopover: true
      })

    }
    console.log("array", array);
    console.log("wayPoints", this.wayPoints);
    this.initMap(array);
  }

  async initMap(array) {

    let style = [];

    //Change Style to night between 7pm to 5am
    if (this.isNight()) {
      style = this.mapStyle
    }

    const position = await this.geolocation.getCurrentPosition();

    let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    console.log("latlng", latLng);

    let options = {
      center: latLng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: style
    }

    this.map = new google.maps.Map(document.getElementById('map_canvas'), options);

    this.loading.dismiss();

    this.loading = await this.loadingCtrl.create({
      message: 'Cargando el mapa',
      spinner: 'dots'
    });

    this.loading.present();


    this.latitud = position.coords.latitude;
    this.longitud = position.coords.longitude;

    // icono de la ubicacion actual
    let iconUbicacion = {
      url: './assets/icon/sero.png',
      scaledSize: new google.maps.Size(30, 30)
    }

    // marcador d ela ubicacion actual
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter(),
      icon: iconUbicacion
    });

    this.loading.dismiss();

    // icono de los marcadores
    let urlIcon = '';

    if (this.idServicioPlaza == 1) {
      urlIcon = './assets/icon/gota.png'
    } else if (this.idServicioPlaza == 2) {
      urlIcon = './assets/icon/icono-predio.png'
    }

    // marcadores de los puntos
    let icon = {
      url: urlIcon,
      scaledSize: new google.maps.Size(30, 30)
    };


    for (let m of array) {
      let marker = new google.maps.Marker({
        map: this.map,
        position: m.position,
        icon: icon
      })

      this.addInfoWindow(marker, m);

    }

  }


  addInfoWindow(marker, m) {


    let infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="text-align:center;">
          <img style="width:40px;" src="assets/icon/sero.png" alt="">
          <h6>Información de la cuenta</h6>
          <p> <span style="font-weight: bold;">Cuenta: </span> ${m.cuenta} </p>
          <p> <span style="font-weight: bold;">Propietario: </span> ${m.propietario} </p>
          <p> <span style="font-weight: bold;">Deuda: </span>$${m.deuda} </p>
          <ion-button color="success" id="btnGestionar"  >Gestionar</ion-button>
        </div>
      `
    });

    marker.addListener('click', () => {
      this.closeAllInfoWindow();
      infoWindow.open(this.map, marker);

      google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
        document.getElementById('btnGestionar').addEventListener('click', () => {
          // metodo para ir a la gestion
          console.log(m);
          this.gestionar(m.cuenta);
        })
      })

    });
    this.infoWindows.push(infoWindow)
  }

  closeAllInfoWindow() {
    for (let window of this.infoWindows) {
      window.close();
    }
  }

  gestionar(cuenta) {
    console.log("Cuenta ", cuenta);
    this.storage.set('account', cuenta);
    this.router.navigateByUrl("/gestion-page");
  }



  async trazarRuta() {

    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();


    this.loading = await this.loadingCtrl.create({
      message: 'Trazando la ruta...',
      spinner: 'dots'
    });

    await this.loading.present();


    //let idAspUser = await this.storage.get("IdAspUser");

    const currentPosition = await this.geolocation.getCurrentPosition();

    // posicion actual
    this.positionActual = new google.maps.LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude);

    setTimeout(() => {
      //let targetPosition = new google.maps.LatLng(this.cuentasDistancia[0].latitud, this.cuentasDistancia[0].longitud)

      let request = {
        origin: this.positionActual,
        destination: this.positionActual,
        waypoints: this.wayPoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.WALKING,
      }

      directionsService.route(request, (result, status) => {
        if (status == 'OK') {
          directionsDisplay.setDirections(result);
        }
      });

      this.loading.dismiss();

      directionsDisplay.setMap(this.map)
    }, 1500)


  }




  async obtenerDistancias() {
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();


    const currentPosition = await this.geolocation.getCurrentPosition();

    let position = new google.maps.LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude);


    var targetPosition = new google.maps.LatLng(this.latitud, this.longitud);

    console.log(position);
    console.log(targetPosition);

    var request = {
      origin: position,
      destination: targetPosition,
      travelMode: 'WALKING'
    }

    directionsService.route(request, (result, status) => {
      if (status == 'OK') {
        directionsDisplay.setDirections(result);
      }
    });

    directionsDisplay.setMap(this.map)
  }


  async find() {
    if (this.accountString == "") {
      alert("Ingresa una cuenta")
    } else {
      this.result = await this.rest.getDataVisitPositionByAccount(this.accountString);
      console.log(this.result)
      if (this.result.length == 0) {
        alert("No hay resultados")
      } else {
        
        let latitud = parseFloat(this.result[0].latitud);
        let longitud = parseFloat(this.result[0].longitud);

        const cameraOptions = {
          tilt: 0,
          heading: 0,
          zoom: 18,
          center: { lat: latitud, lng: longitud },
        };

        this.map.moveCamera(cameraOptions);

        // this.map.setCameraTarget(latLng)
        // this.map.setCameraZoom(20)
      }
    }
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
