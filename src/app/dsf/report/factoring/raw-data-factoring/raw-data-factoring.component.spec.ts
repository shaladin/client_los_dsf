import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RawDataFactoringComponent } from './raw-data-factoring.component';

describe('RawDataFactoringComponent', () => {
  let component: RawDataFactoringComponent;
  let fixture: ComponentFixture<RawDataFactoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RawDataFactoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RawDataFactoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
