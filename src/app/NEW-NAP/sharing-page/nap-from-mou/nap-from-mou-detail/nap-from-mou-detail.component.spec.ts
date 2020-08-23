import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NapFromMouDetailComponent } from './nap-from-mou-detail.component';

describe('NapFromMouDetailComponent', () => {
  let component: NapFromMouDetailComponent;
  let fixture: ComponentFixture<NapFromMouDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NapFromMouDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NapFromMouDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
