import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdOfferingViewComponent } from './prod-offering-view.component';

describe('ProdOfferingViewComponent', () => {
  let component: ProdOfferingViewComponent;
  let fixture: ComponentFixture<ProdOfferingViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdOfferingViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdOfferingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
