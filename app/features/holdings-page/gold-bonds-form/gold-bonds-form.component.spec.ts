import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldBondsFormComponent } from './gold-bonds-form.component';

describe('GoldBondsFormComponent', () => {
  let component: GoldBondsFormComponent;
  let fixture: ComponentFixture<GoldBondsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoldBondsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoldBondsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
