import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NapPagingComponent } from './nap-paging.component';

describe('NapPagingComponent', () => {
  let component: NapPagingComponent;
  let fixture: ComponentFixture<NapPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NapPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NapPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
