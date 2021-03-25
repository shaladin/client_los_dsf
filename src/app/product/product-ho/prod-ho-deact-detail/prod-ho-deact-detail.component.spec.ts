import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdHoDeactDetailComponent } from './prod-ho-deact-detail.component';

describe('ProdHoDeactDetailComponent', () => {
  let component: ProdHoDeactDetailComponent;
  let fixture: ComponentFixture<ProdHoDeactDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdHoDeactDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdHoDeactDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
