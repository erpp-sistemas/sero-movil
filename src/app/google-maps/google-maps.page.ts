import { Component, OnInit, NgZone, ComponentRef, Injector, ComponentFactoryResolver, ApplicationRef } from '@angular/core';
import { RestService } from '../services/rest.service'
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  MarkerCluster,
  Marker,
  LatLng,
  GoogleMapOptions,
  GoogleMapsMapTypeId,
  MyLocation,
  HtmlInfoWindow
} from "@ionic-native/google-maps/ngx";
import { Platform, LoadingController } from '@ionic/angular';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { MessagesService } from '../services/messages.service';
import { CallNumber } from '@ionic-native/call-number/ngx';



@Component({
  selector: 'custom-tag',
  template: `
    <div style="width:190px; height:120px;">
      <div>
        <label ion-label>
          <p style="font-size: 14px; word-wrap: break-word; white-space: normal;">
          <strong>Cuenta:</strong>{{account}}
          <strong>Propietario:</strong>{{owner}}
          <strong>Deuda:$</strong>{{debt}}</p>
        </label>
      </div>
      <button style="background-color: #049c37; padding: 10px; color:white" ion-button size="small" color="success" expand="block" (click)="gestion()">
        Gestionar
      </button>
      <button style="background-color: #2427e4; padding: 10px; color:white; margin-left:10px" ion-button size="small" color="success" expand="block" (click)="street(position)">
        StreetView
      </button>
    </div>
  `
})
export class CustomTag {
  constructor(private router: Router, private storage: Storage, private ngZone: NgZone, private iab: InAppBrowser) { }
  account: string;
  owner: string;
  debt: string;
  position: any

  gestion() {
    this.storage.set("accountNumber", this.account)
    this.ngZone.run(() => {
      this.router.navigateByUrl("/gestion-page")
    })

  }
  goPhotos(account) {
    this.storage.set("accountNumber", account)
    this.ngZone.run(() => {
      this.router.navigateByUrl("/photos-detail")
    })

  }

  async street(position) {
    let latlong = position
    console.log("Entra a ver la position")
    console.log(position)
    this.ngZone.run(() => {

      let navigationExtras: NavigationExtras = {
        state: {
          position: latlong
        }
      };
      this.router.navigate(['streetview'], navigationExtras)
    })

  }

  async goArcgis(account) {
    
    const rutaArcgis = await this.storage.get('rutaArcgis');
    var url = rutaArcgis + '&find=' + account;
    //switch (idPlaza) {
      // case '4': url = 'http://oscarvazquez.maps.arcgis.com/apps/webappviewer/index.html?id=632ea1dc115c4d3fa9960f80b88e37d1&find=' + account; break;
      // case '7': url = 'https://sis-estrategas.maps.arcgis.com/apps/webappviewer/index.html?id=8c5d59991b2c4676952f46a429ed1e2a&find=' + account; break;
      // case '3': url = 'http://oscarvazquez.maps.arcgis.com/apps/webappviewer/index.html?id=632ea1dc115c4d3fa9960f80b88e37d1&find=' + account; break;
      // case '8': url = 'https://cartoestrategas.maps.arcgis.com/apps/webappviewer/index.html?id=bde50fa89665458ab23aca1323b980c4&find=' + account; break;
      // case '10': url = 'https://carto2estrategas.maps.arcgis.com/apps/webappviewer/index.html?id=1ff1f324e54e4b1eac49517ee239567f&find=' + account; break;
      // case '9': url = 'https://carto2estrategas.maps.arcgis.com/apps/webappviewer/index.html?id=6ce8f192dd3a415e94793f48054ea92b&find=' + account; break;
      // case '13': url = 'https://cartoestrategas.maps.arcgis.com/apps/webappviewer/index.html?id=09d157d58e464c57875e0b7e590d9b69&find=' + account; break;
      // case '12': url = 'https://carto2estrategas.maps.arcgis.com/apps/webappviewer/index.html?id=e2aa3190ed0245b596e6e890e84e15bc&find=' + account; break;
      // case '11': url = 'https://carto2estrategas.maps.arcgis.com/apps/webappviewer/index.html?id=e2aa3190ed0245b596e6e890e84e15bc&find=' + account; break;
      // case '25': url = 'https://cartoestrategas.maps.arcgis.com/apps/webappviewer/index.html?id=2737fe33e0a847039bdb3712984100d4&find=' + account; break;
      // case '23': url = 'https://claudiagarcia.maps.arcgis.com/apps/webappviewer/index.html?id=27f6cc2518364b718d2f9e248f407393&find=' + account; break;
      // case '27': url = 'https://claudiagarcia.maps.arcgis.com/apps/webappviewer/index.html?id=0decccf35bd14a6a8c68b277c51a7d1e&find=' + account; break;
      // case '18': url = 'https://camiloerdm.maps.arcgis.com/apps/webappviewer/index.html?id=8b8e7f78b3af45ca8bcb3016e1ef7c0f&find=' + account; break;
      // case '24': url = 'https://camiloerdm.maps.arcgis.com/apps/webappviewer/index.html?id=8b8e7f78b3af45ca8bcb3016e1ef7c0f&find=' + account; break;
      
    //}
    
    console.log(url)
    this.iab.create(url, "_system", { location: 'yes', zoom: 'yes' });

  }
}

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.page.html',
  styleUrls: ['./google-maps.page.scss'],
})
export class GoogleMapsPage implements OnInit {
 
  htmlInfoWindow = new HtmlInfoWindow();
  map: GoogleMap;
  markersArrayInfo: any;
  loading: any;
  accountString: string = "";
  result: any[];
  id_plaza: any;
  idServicioPlaza:any;

  constructor(private ngZone: NgZone,
    private injector: Injector,
    private resolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private storage: Storage,
    private router: Router,
    private platform: Platform,
    private service: RestService,
    private loadingCtrl: LoadingController,
    private mensaje: MessagesService,
    private activeRoute: ActivatedRoute,
    private callNumber: CallNumber
    ) { }

  async ngOnInit() {
    await this.platform.ready();
    console.log("id: ", this.activeRoute.snapshot.paramMap.get('id'));
    console.log("plaza", this.activeRoute.snapshot.paramMap.get('id_plaza'));
    this.idServicioPlaza = this.activeRoute.snapshot.paramMap.get('id');
    this.id_plaza = this.activeRoute.snapshot.paramMap.get('id_plaza');

    await this.getAccountInfo(this.id_plaza, this.idServicioPlaza);
  }

  async ionViewDidEnter() {
   
  }
  

  async loadMap(data) {
    //////////opciones del mapa
    let options: GoogleMapOptions = {
      mapType: GoogleMapsMapTypeId.ROADMAP,
      controls: {
        'compass': true,
        'myLocationButton': true,
        'myLocation': true,   // (blue dot)
        'mapToolbar': true     // android only
      },
      gestures: {
        scroll: true,
        tilt: true,
        zoom: true,
        rotate: true
      }
    }
    /////////////////////////
    this.map = GoogleMaps.create('map_canvas', options);


    this.map.getMyLocation().then(async (location: MyLocation) => {
      //  this.loading.dismiss();
      console.log(JSON.stringify(location, null, 2));

      // Move the map camera to the location with animation

    })
      .catch(err => {

      });
    //////////////////////////
    this.addCluster(data);

    let latLng = data[0].position
    this.map.animateCamera({
      target: latLng,
      zoom: 12,
      tilt: 30
    });

    this.loading.dismiss();
  }

  addCluster(data) {
    console.log("entra")
    console.log(data)
    let markerCluster: MarkerCluster = this.map.addMarkerClusterSync({
      markers: data,
      icons: [
        {
          min: 5,
          max: 20,
          url: "./assets/markercluster/small.png",
          label: {
            color: "white"
          }
        },
        {
          min: 21,
          max: 50,
          url: "./assets/markercluster/large.png",
          label: {
            color: "white"
          }
        },
        {
          min: 51,
          url: "./assets/markercluster/large.png",
          label: {
            color: "white"
          }
        }
      ]
    });



    markerCluster.on(GoogleMapsEvent.MARKER_CLICK).subscribe((params) => {

      let marker: Marker = params.pop();

      // Create a component
      const compFactory = this.resolver.resolveComponentFactory(CustomTag);
      let compRef: ComponentRef<CustomTag> = compFactory.create(this.injector);
      compRef.instance.account = marker.get("cuenta");
      compRef.instance.owner = marker.get("propietario");
      compRef.instance.debt = marker.get("deuda");
      compRef.instance.position = marker.get("position");
      // compRef.instance.lng = marker.get("longitud");

      this.appRef.attachView(compRef.hostView);

      let div = document.createElement('div');
      div.appendChild(compRef.location.nativeElement);

      // Dynamic rendering
      this.ngZone.run(() => {
        this.htmlInfoWindow.setContent(div);
        this.htmlInfoWindow.open(marker);
      });

      // Destroy the component when the htmlInfoWindow is closed.
      this.htmlInfoWindow.one(GoogleMapsEvent.INFO_CLOSE).then(() => {
        compRef.destroy();
      });


    });

  }

  setMarkers(data) {//realiza un ciclo para la carga de los markers 
    let array = []
    
    for (let markers of data) {
      let latlng = new LatLng(parseFloat(markers.latitud), parseFloat(markers.longitud))
      let marker = { position: latlng, cuenta: markers.cuenta, propietario: markers.nombre_propietario, deuda: markers.total }
      array.push(marker)

    }
    console.log("array", array)
    this.loadMap(array)
  }

  async getAccountInfo( id_plaza, idServicioPlaza ) {//realiza la carga de informacion que existe en la base interna sqlite


    this.markersArrayInfo = await this.service.getDataVisitPosition( id_plaza, idServicioPlaza );

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


  goDetail() {
    this.router.navigateByUrl("/detail");
  }
  async getDetail(accountNumber) {
    console.log("this is account to be saved: " + accountNumber)
    await this.storage.set("accountNumber", accountNumber);
    this.goDetail();

  }


  async find() {
    if (this.accountString == "") {
      alert("Ingresa una cuenta")
    } else {

      this.result = await this.service.getDataVisitPositionByAccount(this.accountString);
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
      this.router.navigateByUrl('/servicios-publicos');
    } else if (tipo == 5) {

      this.callNumber.callNumber('18001010101', true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));

    }
  }

  



}
