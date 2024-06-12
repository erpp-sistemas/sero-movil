import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';



@Component({
  selector: 'app-sincronizar-fotos',
  templateUrl: './sincronizar-fotos.page.html',
  styleUrls: ['./sincronizar-fotos.page.scss']
})
export class SincronizarFotosPage implements OnInit {




  constructor(
    private router: Router,
    private callNumber: CallNumber
  ) { }


  

  ngOnInit() {
    
  }
  
  syncFotos() {
    this.router.navigateByUrl('sync-fotos-acciones');
  }

  syncFotosServicios() {
    this.router.navigateByUrl('sync-fotos-servicios');
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

      this.callNumber.callNumber('911', true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));

    }
  } 



}
