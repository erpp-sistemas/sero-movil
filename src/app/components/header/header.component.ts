import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CallNumber } from '@ionic-native/call-number/ngx';

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
    private callNumber: CallNumber
  ) { }

  ngOnInit() {
    this.menuCtrl.close();
  }

  toggleMenu() {
    console.log("Se toco");
    this.menuCtrl.toggle();
  }

  exit() {
    this.auth.logout();
    this.menuCtrl.close();
  }

  checador() {

  }

  manualWeb() {
    
  }

  gestionesRealizadas() {
    console.log("Ir a a gestiones realizadas");
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
    this.router.navigateByUrl('home');
  }

  directorio() {
    this.router.navigateByUrl('/directorio');
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

}