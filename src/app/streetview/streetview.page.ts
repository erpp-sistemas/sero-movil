import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

declare var google;

@Component({
  selector: 'app-streetview',
  templateUrl: './streetview.page.html',
  styleUrls: ['./streetview.page.scss'],
})
export class StreetviewPage implements OnInit {

  id: any;
  Data: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {

    this.route.queryParams.subscribe(params => {

      if (this.router.getCurrentNavigation().extras.state) {
        this.Data = this.router.getCurrentNavigation().extras.state.position;
        this.loadMap(this.Data)
      }
    });

  }


  loadMap(data) {
    console.log(data)
    var map = new google.maps.Map(document.getElementById('maps'), {
      center: data,
      zoom: 14
    });
    var panorama = new google.maps.StreetViewPanorama(
      document.getElementById('pano_canvas'), {
      position: data,
      pov: {
        heading: 34,
        pitch: 10
      }
    });
    map.setStreetView(panorama);
  }

}
