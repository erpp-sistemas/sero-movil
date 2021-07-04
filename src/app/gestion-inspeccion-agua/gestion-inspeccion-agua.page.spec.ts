import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GestionInspeccionAguaPage } from './gestion-inspeccion-agua.page';

describe('GestionInspeccionAguaPage', () => {
  let component: GestionInspeccionAguaPage;
  let fixture: ComponentFixture<GestionInspeccionAguaPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionInspeccionAguaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GestionInspeccionAguaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
