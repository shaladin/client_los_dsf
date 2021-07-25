import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollateraldataComponent } from './collateraldata.component';

describe('CollateraldataComponent', () => {
  let component: CollateraldataComponent;
  let fixture: ComponentFixture<CollateraldataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollateraldataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollateraldataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
