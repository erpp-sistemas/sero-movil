import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SincronizarFotosPageRoutingModule } from './sincronizar-fotos-routing.module';

import { SincronizarFotosPage } from './sincronizar-fotos.page';
import { ImagePreviewPage } from '../image-preview/image-preview.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SincronizarFotosPageRoutingModule,
    ComponentsModule
  ],
  declarations: [SincronizarFotosPage, ImagePreviewPage]
})
export class SincronizarFotosPageModule {}
