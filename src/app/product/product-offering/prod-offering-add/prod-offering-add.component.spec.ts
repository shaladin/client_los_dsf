import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdOfferingAddComponent } from './prod-offering-add.component';

describe('ProdOfferingAddComponent', () => {
  let component: ProdOfferingAddComponent;
  let fixture: ComponentFixture<ProdOfferingAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdOfferingAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdOfferingAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
