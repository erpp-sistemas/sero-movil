import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sincronizar-fotos',
  templateUrl: './sincronizar-fotos.page.html',
  styleUrls: ['./sincronizar-fotos.page.scss']
})
export class SincronizarFotosPage implements OnInit {


  constructor(
    private router: Router
  ) { }


  ngOnInit() {
  }
  
  syncFotos() {
    this.router.navigateByUrl('sync-fotos-acciones');
  }

  syncFotosServicios() {
    this.router.navigateByUrl('sync-fotos-servicios');
  }



}
