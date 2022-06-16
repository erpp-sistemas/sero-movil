import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleMaps, GoogleMap, Marker, GoogleMapsAnimation, MyLocation, GoogleMapOptions, GoogleMapsMapTypeId, LatLng, MarkerIcon, HtmlInfoWindow, GoogleMapsEvent, Polyline } from '@ionic-native/google-maps';
import { LoadingController, Platform } from '@ionic/angular';
import { MessagesService } from '../services/messages.service';
import { RestService } from '../services/rest.service';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-mapa-google',
  templateUrl: './mapa-google.page.html',
  styleUrls: ['./mapa-google.page.scss'],
})
export class MapaGooglePage implements OnInit {

  map: GoogleMap;
  loading: any;
  latitud: string;
  longitud: string;
  markersArrayInfo: any;
  idServicioPlaza: any;
  id_plaza: any;
  cuentasDistancia: any

  frame: HTMLElement;
  htmlInfoWindow: any;

  accountString: string = "";
  result: any[];


  constructor(
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private rest: RestService,
    private mensaje: MessagesService,
    private router: Router,
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

  setMarkers(data) {//realiza un ciclo para la carga de los markers 
    console.log("Set markers");
    let array = []
    for (let markers of data) {
      let latlng = new LatLng(parseFloat(markers.latitud), parseFloat(markers.longitud))
      let marker = {
        position: latlng,
        cuenta: markers.cuenta,
        propietario: markers.propietario,
        deuda: markers.total
      }
      array.push(marker)

    }
    console.log("array", array)
    this.loadMap(array)
  }

  detalleCuenta(data) {
    // ventana
    console.log(data);
    this.htmlInfoWindow = new HtmlInfoWindow();

    this.frame = document.createElement('div');
    this.frame.innerHTML = [
      '<div style="text-align:center"> <img style="width:30px; height:30px" src="assets/icon/sero.png"> </div>',
      '<h3 style="font-size:16px; text-align:center">Información de la cuenta</h3>',
      '<p style="font-size:14px"> <strong> Cuenta: </strong> ' + data.cuenta + '</p>',
      '<p style="font-size:14px"> <strong> Propietario: </strong> ' + data.propietario + '</p>',
      '<p style="font-size:14px"> <strong> Deuda: </strong>$ ' + data.deuda + '</p>',
      '<button style="background-color: rgb(0,200,0); width: 95%; padding: 10px 0; color:white; border-radius:10px" ' +
      '>Gestionar</button>'
    ].join("");
    this.frame.getElementsByTagName("button")[0].addEventListener("click", () => {
      //this.htmlInfoWindow.setBackgroundColor('red');
      this.gestionar(data.cuenta);
    });


    this.htmlInfoWindow.setContent(this.frame, {
      width: "280px",
      height: "230px",
    });
  }

  gestionar(cuenta) {
    console.log("Cuenta ", cuenta);
    this.storage.set('account', cuenta);
    this.router.navigateByUrl("/gestion-page");
  }

  async loadMap(array) {

    let style = [];

    //Change Style to night between 7pm to 5am
    if (this.isNight()) {
      style = this.mapStyle
    }

    let options: GoogleMapOptions = {
      mapType: GoogleMapsMapTypeId.HYBRID,
      controls: {
        compass: true,
        myLocationButton: true,
        myLocation: true,
        mapToolbar: true,
      },
      gestures: {
        scroll: true,
        tilt: true,
        zoom: true,
        rotate: true
      },
      styles: style
    }
    this.map = GoogleMaps.create('map_canvas', options);

    this.loading.dismiss();

    this.loading = await this.loadingCtrl.create({
      message: 'Cargando el mapa',
      spinner: 'dots'
    });

    this.loading.present();

    // obtener la ubicacion
    this.map.getMyLocation().then((location: MyLocation) => {

      this.loading.dismiss();
      console.log(JSON.stringify(location, null, 2));
      this.latitud = location.latLng.lat.toString();
      this.longitud = location.latLng.lng.toString();

      // mover la camara del mapa a la ubicacion con una animacion
      this.map.animateCamera({
        target: location.latLng,
        zoom: 12,
        tilt: 30
      });


      // icono de la ubicacion
      let iconUbicacion: MarkerIcon = {
        url: './assets/icon/sero.png',
        size: {
          width: 30,
          height: 30
        }
      }

      let marker: Marker = this.map.addMarkerSync({
        title: 'Mi ubicación actual',
        position: location.latLng,
        animation: GoogleMapsAnimation.BOUNCE,
        icon: iconUbicacion
      });

      // show the infoWindow
      marker.showInfoWindow();

      // icon de los puntos
      let urlIcon = './assets/icon/icono-predio.png';

      if (this.idServicioPlaza == 1) {
        urlIcon = './assets/icon/gota.png'
      } else if (this.idServicioPlaza == 2) {
        urlIcon = './assets/icon/icono-predio.png'
      }

      // marcadores de los puntos
      let icon: MarkerIcon = {
        url: urlIcon,
        size: {
          width: 35,
          height: 35
        }
      };

      for (let m of array) {
        let marker: Marker = this.map.addMarkerSync({
          position: m.position,
          icon: icon
        })

        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
          console.log(m.cuenta);
          console.log(m.deuda);
          this.detalleCuenta(m);
          this.htmlInfoWindow.open(marker);
        })

      }

    }).catch(error => {
      console.log(error);
      this.loading.dismiss();
    })

  }

  async trazarRuta() {

    let array = []
    for (let markers of this.markersArrayInfo) {
      let latlng = new LatLng(parseFloat(markers.latitud), parseFloat(markers.longitud))
      let marker = {
        position: latlng,
        cuenta: markers.cuenta,
        propietario: markers.propietario,
        deuda: markers.total
      }
      array.push(marker)

    }

    setTimeout(() => {
      this.loading.dismiss();

      this.addPolylines(array);
    }, 2000);

    this.loading = await this.loadingCtrl.create({
      message: 'Trazando ruta...',
      spinner: 'dots'
    });

    this.loading.present();
  }


  addPolylines(array) {

    console.log(array);

    let latlngPosition = new LatLng(parseFloat(this.latitud), parseFloat(this.longitud))
    console.log(latlngPosition)
    

    let arrayPolyline = [];

    arrayPolyline.push(latlngPosition);

    for (let p of array) {
      arrayPolyline.push(p.position);
    }

    console.log(arrayPolyline);

    let polyline: Polyline = this.map.addPolylineSync({
      points: arrayPolyline,
      color: '#0995F2',
      width: 10,
      geodesic: true,
      clickable: true  // clickable = false in default
    })

    polyline.on(GoogleMapsEvent.POLYLINE_CLICK).subscribe((params: any) => {
      let position: LatLng = <LatLng>params[0];
      this.map.addMarker({
        position: position,
        title: position.toUrlValue(),
        disableAutoPan: true
      }).then((marker: Marker) => {
        marker.showInfoWindow();
      });
    });
  }


  async obtenerDistancias() {

    let idAspUser = await this.storage.get("IdAspUser");

    this.cuentasDistancia =
      await this.rest.obtenerCuentasDistancias(idAspUser, this.id_plaza, this.idServicioPlaza, this.latitud, this.longitud)


    let array = []


    for (let markers of this.cuentasDistancia) {
      let latlng = new LatLng( markers.latitud , markers.longitud )
      let marker = {
        position: latlng
        // cuenta: markers.cuenta,
        // propietario: markers.propietario,
        // total: markers.propietario
      }
      array.push(marker)

    }


    setTimeout(() => {
      this.loading.dismiss();

      this.addPolylines(array);
    }, 2000);

    this.loading = await this.loadingCtrl.create({
      message: 'Trazando ruta...',
      spinner: 'dots'
    });

    this.loading.present();


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
        let latLng = new LatLng(this.result[0].latitud, this.result[0].longitud)
        console.log(latLng)
        this.map.setCameraTarget(latLng)
        this.map.setCameraZoom(20)
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

      this.callNumber.callNumber('911', true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));

    }
  }



}
