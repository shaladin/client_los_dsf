import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdHoViewComponent } from './prod-ho-view.component';

describe('ProdHoViewComponent', () => {
  let component: ProdHoViewComponent;
  let fixture: ComponentFixture<ProdHoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdHoViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdHoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
