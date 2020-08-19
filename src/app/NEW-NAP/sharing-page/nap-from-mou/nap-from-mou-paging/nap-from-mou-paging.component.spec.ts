import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NapFromMouPagingComponent } from './nap-from-mou-paging.component';

describe('NapFromMouPagingComponent', () => {
  let component: NapFromMouPagingComponent;
  let fixture: ComponentFixture<NapFromMouPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NapFromMouPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NapFromMouPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
