import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa-leaflet',
  templateUrl: './mapa-leaflet.page.html',
  styleUrls: ['./mapa-leaflet.page.scss'],
})
export class MapaLeafletPage implements OnInit {

  map: any;


  constructor() { }



  ngOnInit() {
    console.log("Mostrando el mapa offline");
    this.map = L.map('map').
      setView([19.3162857, -99.7482662],
        12);

    L.tileLayer('assets/mapa/{z}/{x}/{y}.png', { maxZoom: 15 }).addTo(this.map);

    // L.marker([19.2627942, 99.8166932], { draggable: true }).addTo(this.map);
  }

}
