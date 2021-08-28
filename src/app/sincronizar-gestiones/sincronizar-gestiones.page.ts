import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-sincronizar-gestiones',
  templateUrl: './sincronizar-gestiones.page.html',
  styleUrls: ['./sincronizar-gestiones.page.scss'],
})
export class SincronizarGestionesPage implements OnInit {

  constructor(
    private router: Router,
    private callNumber: CallNumber
  ) { }

  ngOnInit() {
  }

  syncAgua() {
    this.router.navigateByUrl('/sincronizar-agua');
  }

  syncPredio() {
    this.router.navigateByUrl('/sincronizar-predio');
  }

  syncServicios() {
    this.router.navigateByUrl('/sincronizar-servicios');
  }

  syncAntenas() {
    this.router.navigateByUrl('/sincronizar-antenas');
  }

  syncPozos() {
    this.router.navigateByUrl('/sincronizar-pozos');
  }

  navegar(tipo) {
    if (tipo == 1) {
      this.router.navigateByUrl('home/tab1');
    } else if (tipo == 2) {
      this.router.navigateByUrl('home/tab2');
    } else if (tipo == 3) {
      this.router.navigateByUrl('home/tab3');
    } else if (tipo == 4) {
      this.router.navigateByUrl('/servicios-publicos');
    } else if (tipo == 5) {

      this.callNumber.callNumber('18001010101', true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));

    }
  }



}
