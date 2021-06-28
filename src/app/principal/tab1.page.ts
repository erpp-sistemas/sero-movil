import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  imgAvatar: string = '/assets/avatars/';
  nombre: string = '';
  email: string = '';
  plaza: string = '';

  constructor(
    private storage: Storage,
    private menuCtrl: MenuController,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.mostrarAvatar();
    this.obtenerDatosUsuario();
  }

  async mostrarAvatar() {
    this.imgAvatar += await this.storage.get('ImgAvatar');
    console.log(this.imgAvatar);
  }

  async obtenerDatosUsuario() {
    this.nombre = await this.storage.get('Nombre');
    this.email = await this.storage.get('Email');
    this.plaza = await this.storage.get('Plaza');
  }

  descargarInformacion() {

  }


  toggleMenu() {
    this.menuCtrl.toggle();
  }


  exit() {
    this.auth.logout();
  }


}
