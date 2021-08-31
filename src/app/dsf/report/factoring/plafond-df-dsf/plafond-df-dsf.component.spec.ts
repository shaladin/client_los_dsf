import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlafondDfDsfComponent } from './plafond-df-dsf.component';

describe('PlafondDfDsfComponent', () => {
  let component: PlafondDfDsfComponent;
  let fixture: ComponentFixture<PlafondDfDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlafondDfDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlafondDfDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
