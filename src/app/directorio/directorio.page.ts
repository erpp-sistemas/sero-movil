import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { EmailComposer } from '@ionic-native/email-composer/ngx';


@Component({
  selector: 'app-directorio',
  templateUrl: './directorio.page.html',
  styleUrls: ['./directorio.page.scss'],
})
export class DirectorioPage implements OnInit {


  contactos = [];
  countryCode = '+521';

  constructor(
    private callNumber: CallNumber,
    private iab: InAppBrowser,
    private menuCtrl: MenuController,
    private auth: AuthService,
    private router: Router,
    private emailComposer: EmailComposer
  ) { }

  ngOnInit() {
    this.contactos = [
      {
        nombre: 'Miguel Santa Ana',
        puesto: 'Presidente',
        area: 'Dirección',
        telefono: '5525610168',
        email: 'santaanam@yahoo.com.mx'
      },
      {
        nombre: 'Roberto Gomez Henriquez',
        puesto: 'Director General',
        area: 'Dirección',
        telefono: '7773288310',
        email: 'roberto_gohr@hotmail.com'
      },
      {
        nombre: 'Jhovanny Cedillo',
        puesto: 'Director de operaciones',
        area: 'Dirección',
        telefono: '5533991401',
        email: 'jhovanny.cedillo@sero.mx'
      },
      {
        nombre: 'Alejandro Aguilar',
        puesto: 'Sub-director de operaciones',
        area: 'Dirección',
        telefono: '6673070353',
        email: 'alejandro.alderete@sero.mx'
      },
      {
        nombre: 'Carlos Martinez',
        puesto: 'Gerente tecnoligía web',
        area: 'Tecnolgias de la información',
        telefono: '5537772092',
        email: 'engineer_carlos@hotmail.com'
      },
      {
        nombre: 'Antonio Ticante',
        puesto: 'Gerente tecnología móvil',
        area: 'Tecnolgias de la información',
        telefono: '5531284105',
        email: 'antonio.ticante12@gmail.com'
      }
    ]
  }

  phone( numero: string) {
    this.callNumber.callNumber(numero, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }


  whatsapp( numero: string ) {
    let url =  `https://api.whatsapp.com/send?phone=${this.countryCode}${numero}`;
    this.iab.create(url, "_system");
  }


  find( event ) {

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
