import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CardPreferenciaElectoralComponent } from './card-preferencia-electoral.component';

describe('CardPreferenciaElectoralComponent', () => {
  let component: CardPreferenciaElectoralComponent;
  let fixture: ComponentFixture<CardPreferenciaElectoralComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardPreferenciaElectoralComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CardPreferenciaElectoralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
