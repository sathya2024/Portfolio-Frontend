import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BondsFormComponent } from './bonds-form.component';

describe('BondsFormComponent', () => {
  let component: BondsFormComponent;
  let fixture: ComponentFixture<BondsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BondsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BondsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
