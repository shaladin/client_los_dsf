import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdHoAddComponent } from './prod-ho-add.component';

describe('ProdHoAddComponent', () => {
  let component: ProdHoAddComponent;
  let fixture: ComponentFixture<ProdHoAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdHoAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdHoAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
