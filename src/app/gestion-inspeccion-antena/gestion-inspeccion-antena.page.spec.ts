import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GestionInspeccionAntenaPage } from './gestion-inspeccion-antena.page';

describe('GestionInspeccionAntenaPage', () => {
  let component: GestionInspeccionAntenaPage;
  let fixture: ComponentFixture<GestionInspeccionAntenaPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionInspeccionAntenaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GestionInspeccionAntenaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
