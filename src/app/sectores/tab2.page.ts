import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


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
  private router:Router
) {}

ngOnInit() {

}
 
irAgua() {
  console.log("agua");
  this.router.navigate(["/listado-cuentas", 1]);
}

irPredio() {
  console.log("predio");
  this.router.navigate(["/listado-cuentas", 2]);
}

irAntenas() {
  console.log("antenas");
  this.router.navigate(["/listado-cuentas", 3]);
}

irPozos() {
  console.log("pozos");
  this.router.navigate(["/listado-cuentas", 4]);
}

}
