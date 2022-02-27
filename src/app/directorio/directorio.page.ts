import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { RestService } from '../services/rest.service';


@Component({
  selector: 'app-directorio',
  templateUrl: './directorio.page.html',
  styleUrls: ['./directorio.page.scss'],
})
export class DirectorioPage implements OnInit {


  contactos: any;
  countryCode = '+521';
  findText: string = '';
  busqueda: boolean = false;

  constructor(
    private callNumber: CallNumber,
    private iab: InAppBrowser,
    private menuCtrl: MenuController,
    private auth: AuthService,
    private router: Router,
    private emailComposer: EmailComposer,
    private rest: RestService
  ) { }

  async ngOnInit() {
    await this.obtenerInformacionEmpleados();
  }

  async obtenerInformacionEmpleados() {
    this.contactos = await this.rest.obtenerInformacionEmpleados();
    console.log(this.contactos);
  }

  phone( numero: string) {
    this.callNumber.callNumber(numero, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }


  whatsapp( numero: string ) {
    let url =  `https://api.whatsapp.com/send?phone=${this.countryCode}${numero}`;
    console.log(numero);
    console.log(url);
    this.iab.create(url, "_system");
  }


  find( event ) {
    this.busqueda = true;
    this.findText = event.detail.value;
  }

  email( emailEnviar ) {
    console.log("Enviando email");
    console.log(emailEnviar);
    this.emailComposer.open({
      to: emailEnviar
    });

  }

  navegar(tipo) {
    if (tipo == 1) {
      this.router.navigateByUrl('home/tab1');
    } else if (tipo == 2) {
      this.router.navigateByUrl('home/tab2');
    } else if (tipo == 3) {
      this.router.navigateByUrl('home/tab3');
    } else if (tipo == 4) {
      this.router.navigateByUrl('home/tab4');
    } else if (tipo == 5) {

      this.callNumber.callNumber('18001010101', true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));

    }
  } 



}
