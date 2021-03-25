import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdHoAddDetailComponent } from './prod-ho-add-detail.component';

describe('ProdHoAddDetailComponent', () => {
  let component: ProdHoAddDetailComponent;
  let fixture: ComponentFixture<ProdHoAddDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdHoAddDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdHoAddDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
