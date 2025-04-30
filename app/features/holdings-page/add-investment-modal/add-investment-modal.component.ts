import { Component } from '@angular/core';
import { ModalService } from 'modal-popup-angular-18';
import { StocksFormComponent } from '../stocks-form/stocks-form.component';
import { BondsFormComponent } from '../bonds-form/bonds-form.component';
import { MutualFundsFormComponent } from '../mutual-funds-form/mutual-funds-form.component';
import { GoldBondsFormComponent } from '../gold-bonds-form/gold-bonds-form.component';

@Component({
  selector: 'app-add-investment-modal',
  standalone: true,
  templateUrl: './add-investment-modal.component.html',
  styleUrls: ['./add-investment-modal.component.scss'],
  imports: [
    StocksFormComponent,
    BondsFormComponent,
    MutualFundsFormComponent,
    GoldBondsFormComponent,
  ],
})
export class AddInvestmentModalComponent {
  constructor(private modal: ModalService) {}

  openInvestmentForm(type: string) {
    let modalRef: any;
    switch (type) {
      case 'stocks':
        this.modal.open(StocksFormComponent, {
          title: 'Add Stocks Manually',
          size: { width: '600px' },
        });
        break;
      case 'bonds':
        this.modal.open(BondsFormComponent, {
          title: 'Bond & Other Fixed Income',
          size: { width: '600px' },
        });
        break;
      case 'mutualfunds':
        this.modal.open(MutualFundsFormComponent, {
          title: 'Add Funds Manually',
          size: { width: '600px' },
        });
        break;
      case 'goldbonds':
        this.modal.open(GoldBondsFormComponent, {
          title: 'Sovereign Gold Bonds',
          size: { width: '600px' },
        });
        break;
    }
    if (modalRef) {
      this.modal.close(modalRef.id);
    }
  }
}
