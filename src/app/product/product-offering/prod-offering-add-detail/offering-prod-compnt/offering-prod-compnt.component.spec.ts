import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferingProdCompntComponent } from './offering-prod-compnt.component';

describe('OfferingProdCompntComponent', () => {
  let component: OfferingProdCompntComponent;
  let fixture: ComponentFixture<OfferingProdCompntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferingProdCompntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferingProdCompntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
