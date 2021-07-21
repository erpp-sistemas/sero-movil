import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GoogleMapsPage } from '../google-maps/google-maps.page';
import { Router } from '@angular/router';



@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  
  modal:any;

  constructor(
    private modalCtrl: ModalController,
    private router:Router
  ) { }

  async ngOnInit() {
    
  }


  async googleMaps() {
    this.router.navigateByUrl("/google-maps");
  }

  async pozos() {
    this.router.navigateByUrl("/pozo-conagua");
  }
  
  async cartografia() {
    //this.router.navigateByUrl("/cartografia-s");
  }

  async predio() {
    this.router.navigateByUrl("/google-maps");
  }

  

  
}
