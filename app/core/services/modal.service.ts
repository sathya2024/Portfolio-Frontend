import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ModalType =
  | 'investment-type'
  | 'stock'
  | 'bond'
  | 'mutual-fund'
  | 'gold-bond'
  | null;

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private activeModalSubject = new BehaviorSubject<ModalType>(null);
  activeModal$ = this.activeModalSubject.asObservable();

  openModal(type: ModalType): void {
    this.activeModalSubject.next(type);
  }

  closeModal(): void {
    this.activeModalSubject.next(null);
  }
}
