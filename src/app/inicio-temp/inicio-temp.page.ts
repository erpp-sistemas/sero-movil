import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { VideoPresentacionPage } from '../video-presentacion/video-presentacion.page'

@Component({
  selector: 'app-inicio-temp',
  templateUrl: './inicio-temp.page.html',
  styleUrls: ['./inicio-temp.page.scss'],
})
export class InicioTempPage implements OnInit {

  modal: any;

  constructor(
    private modalCtrl: ModalController,
    private router: Router
  ) { }

  ngOnInit() {
    //this.llamarVideoPresentacion();
  }

  ionViewDidEnter() {
    this.llamarVideoPresentacion();
  }

  async llamarVideoPresentacion() {
    
    this.modal = await this.modalCtrl.create({
      component: VideoPresentacionPage
    });

    this.modal.present()

    this.modal.onDidDismiss().then(data => {
      this.router.navigate(['home']);
    })
  }

}
