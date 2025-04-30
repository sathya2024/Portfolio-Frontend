import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksFormComponent } from './stocks-form.component';

describe('StocksFormComponent', () => {
  let component: StocksFormComponent;
  let fixture: ComponentFixture<StocksFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StocksFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StocksFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
