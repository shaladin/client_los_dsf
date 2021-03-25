import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdHoRvwDetailComponent } from './prod-ho-rvw-detail.component';

describe('ProdHoRvwDetailComponent', () => {
  let component: ProdHoRvwDetailComponent;
  let fixture: ComponentFixture<ProdHoRvwDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdHoRvwDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdHoRvwDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
