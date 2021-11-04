import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOutstandingComponent } from './list-outstanding.component';

describe('ListOutstandingComponent', () => {
  let component: ListOutstandingComponent;
  let fixture: ComponentFixture<ListOutstandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOutstandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOutstandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
