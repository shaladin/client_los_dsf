import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuratkonfirmasipersetujuanComponent } from './suratkonfirmasipersetujuan.component';

describe('SuratkonfirmasipersetujuanComponent', () => {
  let component: SuratkonfirmasipersetujuanComponent;
  let fixture: ComponentFixture<SuratkonfirmasipersetujuanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuratkonfirmasipersetujuanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuratkonfirmasipersetujuanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
