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
import { DblocalService } from '../services/dblocal.service';



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
      <button style="background-color: #049c37; padding: 10px; color:white" ion-button size="small" color="success" expand="block" (click)="gestion(account)">
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

  gestion(account) {
    this.storage.set('account', account);
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
  idServicioPlaza: any;
  div: any;
  compRef: ComponentRef<CustomTag>
  markerCluster: MarkerCluster
  compFactory: any;

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
    private callNumber: CallNumber,
    private dbLocalService: DblocalService
  ) { }

  async ngOnInit() {
    await this.platform.ready();
    this.idServicioPlaza = this.activeRoute.snapshot.paramMap.get('id');
    this.id_plaza = this.activeRoute.snapshot.paramMap.get('id_plaza');

    await this.getAccountInfo(this.id_plaza, this.idServicioPlaza);
  }


  ionViewWillLeave() {

  }

  async getAccountInfo(id_plaza, idServicioPlaza) {//realiza la carga de informacion que existe en la base interna sqlite

    this.markersArrayInfo = await this.dbLocalService.getDataVisitPosition(id_plaza, idServicioPlaza);

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
    let array = []
    for (let markers of data) {
      let latlng = new LatLng(parseFloat(markers.latitud), parseFloat(markers.longitud))
      let marker = {
        position: latlng,
        cuenta: markers.cuenta,
        propietario: markers.propietario,
        deuda: markers.total,
        icon: '../../assets/icon/gota.png'
      }
      array.push(marker)

    }
    this.loadMap(array)
  }



  async loadMap(data) {
    //////////opciones del mapa
    let options: GoogleMapOptions = {
      mapType: GoogleMapsMapTypeId.ROADMAP,
      controls: {
        'compass': true,
        'myLocationButton': true,
        'mapTypeControl': true,
        'streetViewControl': true,
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
    this.markerCluster = this.map.addMarkerClusterSync({
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



    this.markerCluster.on(GoogleMapsEvent.MARKER_CLICK).subscribe((params) => {

      let marker: Marker = params.pop();

      // Create a component
      this.compFactory = this.resolver.resolveComponentFactory(CustomTag);
      this.compRef = this.compFactory.create(this.injector);
      this.compRef.instance.account = marker.get("cuenta");
      this.compRef.instance.owner = marker.get("propietario");
      this.compRef.instance.debt = marker.get("deuda");
      this.compRef.instance.position = marker.get("position");
      // compRef.instance.lng = marker.get("longitud");

      this.appRef.attachView(this.compRef.hostView);

      this.div = document.createElement('div');
      this.div.appendChild(this.compRef.location.nativeElement);

      // Dynamic rendering
      this.ngZone.run(() => {
        this.htmlInfoWindow.setContent(this.div);
        this.htmlInfoWindow.open(marker);
      });

      // Destroy the component when the htmlInfoWindow is closed.
      this.htmlInfoWindow.one(GoogleMapsEvent.INFO_CLOSE).then(() => {
        this.compRef.destroy();
      });


    });

  }



  goDetail() {
    this.router.navigateByUrl("/detail");
  }

  async getDetail(accountNumber) {
    await this.storage.set("accountNumber", accountNumber);
    this.goDetail();

  }


  async find() {
    if (this.accountString == "") {
      alert("Ingresa una cuenta")
    } else {

      this.result = await this.dbLocalService.getDataVisitPositionByAccount(this.accountString);
      if (this.result.length == 0) {
        alert("No hay resultados")
      } else {
        let latLng = new LatLng(this.result[0].latitud, this.result[0].longitud)
        this.map.setCameraTarget(latLng)
        this.map.setCameraZoom(20)
      }
    }
  }

  navegar(tipo) {

    if (tipo == 1) {
      this.ngZone.run(() => {
        this.router.navigateByUrl("home/tab1")
      })
    } else if (tipo == 2) {
      this.ngZone.run(() => {
        this.router.navigateByUrl("home/tab2")
      })
    } else if (tipo == 3) {
      this.ngZone.run(() => {
        this.router.navigateByUrl("home/tab3")
      })
    } else if (tipo == 4) {
      this.ngZone.run(() => {
        this.router.navigateByUrl("home/tab4")
      })
    } else if (tipo == 5) {

      this.callNumber.callNumber('911', true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));

    }
  }





}
