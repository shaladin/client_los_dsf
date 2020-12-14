import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrdRvwRapindoComponent } from './crd-rvw-rapindo.component';

describe('CrdRvwRapindoComponent', () => {
  let component: CrdRvwRapindoComponent;
  let fixture: ComponentFixture<CrdRvwRapindoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrdRvwRapindoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrdRvwRapindoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
