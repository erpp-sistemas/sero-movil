import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GestionInspeccionPredioPage } from './gestion-inspeccion-predio.page';

describe('GestionInspeccionPredioPage', () => {
  let component: GestionInspeccionPredioPage;
  let fixture: ComponentFixture<GestionInspeccionPredioPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionInspeccionPredioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GestionInspeccionPredioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
