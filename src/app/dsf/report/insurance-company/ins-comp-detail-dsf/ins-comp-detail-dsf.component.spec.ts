import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsCompDetailDsfComponent } from './ins-comp-detail-dsf.component';

describe('InsCompDetailDsfComponent', () => {
  let component: InsCompDetailDsfComponent;
  let fixture: ComponentFixture<InsCompDetailDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsCompDetailDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsCompDetailDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
