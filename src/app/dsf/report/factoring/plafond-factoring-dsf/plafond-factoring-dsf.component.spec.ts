import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlafondFactoringDsfComponent } from './plafond-factoring-dsf.component';

describe('PlafondFactoringDsfComponent', () => {
  let component: PlafondFactoringDsfComponent;
  let fixture: ComponentFixture<PlafondFactoringDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlafondFactoringDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlafondFactoringDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
