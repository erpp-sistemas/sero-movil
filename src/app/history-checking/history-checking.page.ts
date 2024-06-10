import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-history-checking',
  templateUrl: './history-checking.page.html',
  styleUrls: ['./history-checking.page.scss'],
})
export class HistoryCheckingPage implements OnInit {

  @Input() data: any[]; 

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  back() {
    this.modalController.dismiss();
  }


}
