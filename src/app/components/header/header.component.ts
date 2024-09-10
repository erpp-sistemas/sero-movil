import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  constructor(
    private menuCtrl: MenuController,
    private auth: AuthService,
    private router: Router,
    private iab: InAppBrowser,
    private callNumber: CallNumber
  ) { }

  ngOnInit() {
    this.menuCtrl.close();
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  exit() {
    this.auth.logout();
    this.menuCtrl.close();
  }

  checador() {
    this.menuCtrl.close();
    this.router.navigateByUrl('/checador');
  }


  async manualWeb() {
    let link = 'https://erpp-movil.web.app/'
    this.iab.create(link, "_system", { location: "yes", zoom: "yes" });
  }

  gestionesRealizadas() {
    this.menuCtrl.close();
    this.router.navigateByUrl('/sincronizar-gestiones')
  }

  help(numero:string) {
    this.callNumber.callNumber(numero, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }

  irPrincipal() {
    this.menuCtrl.close();
    this.router.navigateByUrl('/home');
  }

  directorio() {
    this.router.navigateByUrl('/directorio');
    this.menuCtrl.close();
  }

  encuestasList() {
    this.router.navigateByUrl('/home/tab4');
    this.menuCtrl.close();
  }

  servicios() {
    this.router.navigateByUrl('/servicios-publicos');
    this.menuCtrl.close();
  }

  sincronizarFotos() {
    this.router.navigateByUrl('/sincronizar-fotos');
    this.menuCtrl.close();
  }

  botonPanico() {
    this.router.navigateByUrl('/boton-panico');
    this.menuCtrl.close();
  }

  notificaciones() {
    this.router.navigateByUrl('/push-notifications');
    this.menuCtrl.close();
  }

}
