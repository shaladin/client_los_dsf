import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdOfferingRvwDetailComponent } from './prod-offering-rvw-detail.component';

describe('ProdOfferingRvwDetailComponent', () => {
  let component: ProdOfferingRvwDetailComponent;
  let fixture: ComponentFixture<ProdOfferingRvwDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdOfferingRvwDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdOfferingRvwDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
