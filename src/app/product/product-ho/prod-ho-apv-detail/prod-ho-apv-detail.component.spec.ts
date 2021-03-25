import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdHoApvDetailComponent } from './prod-ho-apv-detail.component';

describe('ProdHoApvDetailComponent', () => {
  let component: ProdHoApvDetailComponent;
  let fixture: ComponentFixture<ProdHoApvDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdHoApvDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdHoApvDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
