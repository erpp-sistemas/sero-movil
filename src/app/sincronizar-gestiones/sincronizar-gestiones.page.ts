import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sincronizar-gestiones',
  templateUrl: './sincronizar-gestiones.page.html',
  styleUrls: ['./sincronizar-gestiones.page.scss'],
})
export class SincronizarGestionesPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  syncAgua() {
    this.router.navigateByUrl('/sincronizar-agua');
  }

  syncPredio() {
    this.router.navigateByUrl('/sincronizar-predio');
  }

  syncAntenas() {
    this.router.navigateByUrl('/sincronizar-antenas');
  }

  syncPozos() {
    this.router.navigateByUrl('/sincronizar-pozos');
  }

}
