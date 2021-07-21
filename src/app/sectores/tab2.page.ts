import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page implements OnInit {

agua: boolean;
predio: boolean;
antenas:boolean;
pozos: boolean;


constructor(
  private router:Router,
  private storage: Storage
) {}

ngOnInit() {

}
 
async irAgua() {
  console.log("agua");
  await this.storage.set('tipo', 'Agua');
  this.router.navigate(["/listado-cuentas", 1]);
}

async irPredio() {
  console.log("predio");
  await this.storage.set('tipo', 'Predio');
  this.router.navigate(["/listado-cuentas", 2]);
}

async irAntenas() {
  console.log("antenas");
  this.router.navigate(["/listado-cuentas", 3]);
}

async irPozos() {
  console.log("pozos");
  this.router.navigate(["/listado-cuentas", 4]);
}

}
