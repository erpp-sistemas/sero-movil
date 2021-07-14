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
import { Router, NavigationExtras } from '@angular/router';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'custom-tag',
  template: `
    <div style="width:190px; height:200px;">
      <div>
        <label ion-label>
          <p style="font-size: 8px; word-wrap: break-word; white-space: normal;">
          <strong>Folio:</strong>{{folio}}
          <strong>Numero_Titulo:</strong>{{numero_titulo}}
          <strong>Titular:</strong>{{titular}}
          <strong>Representante_Legal:</strong>{{representante_legal}}
          <strong>RFC:</strong>{{rfc}}
          <strong>Domicilio:</strong>{{domicilio}}
          <strong>Municipio:</strong>{{municipio}}
          <strong>Uso_Agua:</strong>{{uso_agua}}
          <strong>Vol_Ext_Anu:</strong>{{vol_ext_anu}}
          <strong>Vol_Con_Anu:</strong>{{vol_con_anu}}
          <strong>Profundidad:$</strong>{{profundidad}}</p>
        </label>
      </div>
      <button ion-button size="small" color="success" expand="block" (click)="street(position)">
        StreetView
      </button>
    </div>
  `
})
export class CustomTag {
  constructor(private router: Router, private storage: Storage, private ngZone: NgZone, private iab: InAppBrowser) { }
  folio: string;
  numero_titulo: string;
  titular: string;
  representante_legal: string;
  rfc:string;
  uso_agua:string;
  domicilio: string;
  municipio:string;
  vol_ext_anu:string;
  vol_con_anu:string;
  profundidad:string;
  position: any


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

 
}

@Component({
  selector: 'app-pozo-conagua',
  templateUrl: './pozo-conagua.page.html',
  styleUrls: ['./pozo-conagua.page.scss'],
})
export class PozoConaguaPage implements OnInit {

  htmlInfoWindow = new HtmlInfoWindow();
  map: GoogleMap;
  markersArrayInfo: any;
  loading: any;
  accountString: string = "";
  result: any[];

  constructor(private ngZone: NgZone,
    private injector: Injector,
    private resolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private storage: Storage,
    private router: Router,
    private platform: Platform,
    private service: RestService,
    private loadingCtrl: LoadingController,
    private mensaje: MessagesService) { }

  async ngOnInit() {
    await this.platform.ready();
    await this.getAccountInfo();
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
      compRef.instance.folio = marker.get("folio");
      compRef.instance.numero_titulo = marker.get("numero_titulo");
      compRef.instance.titular = marker.get("titular");
      compRef.instance.representante_legal = marker.get("representante_legal");
      compRef.instance.rfc = marker.get("rfc");
      compRef.instance.domicilio = marker.get("domicilio");
      compRef.instance.municipio = marker.get("municipio");
      compRef.instance.uso_agua = marker.get("uso_agua");
      compRef.instance.vol_ext_anu = marker.get("vol_ext_anu");
      compRef.instance.vol_con_anu = marker.get("vol_con_anu");
      compRef.instance.profundidad = marker.get("profundidad");
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
    console.log("data", data);
    for (let markers of data) {
      let latlng = new LatLng(parseFloat(markers.latitud), parseFloat(markers.longitud))
      let marker = { position: latlng, folio: markers.folio, numero_titulo: markers.numero_titulo, titular: markers.titular, representante_legal: markers.representante_legal, rfc: markers.rfc, domicilio: markers.domicilio, municipio: markers.municipio, uso_agua: markers.uso_agua, vol_ext_anu: markers.vol_ext_anu, vol_con_anu: markers.vol_con_anu, profundidad: markers.profundidad }
      array.push(marker)

    }
    console.log("array", array)
    this.loadMap(array)
  }

  async getAccountInfo() {//realiza la carga de informacion que existe en la base interna sqlite


    this.markersArrayInfo = await this.service.getDataVisitPositionPozos();

    if (this.markersArrayInfo.length <= 0) {
      // await this.setMarkers(this.markersArrayInfo);  
      this.mensaje.showAlert('Debes descargar informaciòn de pozos para ver el mapa!!')
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





}
