import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
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
    private emailComposer: EmailComposer,
    private rest: RestService
  ) { }

  async ngOnInit() {
    await this.obtenerInformacionEmpleados();
  }

  async obtenerInformacionEmpleados() {
    this.contactos = await this.rest.obtenerInformacionEmpleados();
    //console.log(this.contactos);
  }

  phone( numero: string) {
    this.callNumber.callNumber(numero, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }


  whatsapp( numero: string ) {
    let url =  `https://api.whatsapp.com/send?phone=${this.countryCode}${numero}`;
    // console.log(numero);
    // console.log(url);
    this.iab.create(url, "_system");
  }


  find( event ) {
    this.busqueda = true;
    this.findText = event.detail.value;
  }

  email( emailEnviar ) {
    this.emailComposer.open({
      to: emailEnviar
    });

  }


}
