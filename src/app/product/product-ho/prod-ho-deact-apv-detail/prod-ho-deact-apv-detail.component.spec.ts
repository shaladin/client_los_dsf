import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdHoDeactApvDetailComponent } from './prod-ho-deact-apv-detail.component';

describe('ProdHoDeactApvDetailComponent', () => {
  let component: ProdHoDeactApvDetailComponent;
  let fixture: ComponentFixture<ProdHoDeactApvDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdHoDeactApvDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdHoDeactApvDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
