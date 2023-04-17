import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CardAprobacionAutoridadesComponent } from './card-aprobacion-autoridades.component';

describe('CardAprobacionAutoridadesComponent', () => {
  let component: CardAprobacionAutoridadesComponent;
  let fixture: ComponentFixture<CardAprobacionAutoridadesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardAprobacionAutoridadesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CardAprobacionAutoridadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
