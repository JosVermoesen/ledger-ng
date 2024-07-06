import { Injectable } from '@angular/core';
// import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ILedgerEntry, ILedgerEntryItem, ILedgerEntrySolde, LedgerEntry } from '../models/ledgerEntry';

@Injectable({
  providedIn: 'root'
})
export class LedgerEntryService {
  // baseUrl = environment.apiUrl;
  private ledgerEntrySource = new BehaviorSubject<ILedgerEntry>(null);
  ledgerEntry$ = this.ledgerEntrySource.asObservable();

  private ledgerEntrySoldeSource = new BehaviorSubject<ILedgerEntrySolde>(null);
  ledgerEntrySolde$ = this.ledgerEntrySoldeSource.asObservable();

  constructor(private http: HttpClient) { }

  private createLedgerEntry(): ILedgerEntry {
    const newLedgerEntry = new LedgerEntry();
    localStorage.setItem('ledgerEntry_id', newLedgerEntry.id);
    localStorage.setItem(newLedgerEntry.id, JSON.stringify(newLedgerEntry))
    return newLedgerEntry;
  }

  getLedgerEntry(id: string) {
    // LOCALSTORE !!
    return this.http
      .get('assets/dummy.txt', {
        responseType: 'text',
      })
      .pipe(
        map(() => {
          const busyWithLedgerEntry: ILedgerEntry = JSON.parse(localStorage.getItem(id));
          this.ledgerEntrySource.next(busyWithLedgerEntry);
          // console.log(this.getCurrentBasketValue());
          this.calculateCubeAmount();
        })
      );

    // REDIS !!
    /* return this.http.get(this.baseUrl + 'ledgerentry?id=' + id)
      .pipe(
        map((basket: IBasket) => {
          this.basketSource.next(basket);
          // console.log(this.getCurrentBasketValue());
          this.calculateCubeAmount();
        })
      ); */
  }

  setLedgerEntry(ledgerEntry: ILedgerEntry) {
    // LOCALSTORE !!
    return this.http
      .get('assets/dummy.txt', {
        responseType: 'text',
      })
      .subscribe(() => {
        localStorage.setItem(ledgerEntry.id, JSON.stringify(ledgerEntry));
        this.ledgerEntrySource.next(ledgerEntry);
        this.calculateCubeAmount();
      });

    // REDIS !!
    /* return this.http.post(this.baseUrl + 'ledgerentry', basket)
      .subscribe((response: IBasket) => {
        this.basketSource.next(response);
        console.log(response);
        this.calculateCubeAmount();
      }, error => {
        console.log(error);
      }); */
  }

  getCurrentLedgerEntryValue() {
    return this.ledgerEntrySource.value;
  }

  addItemToLedgerEntry(
    item: ILedgerEntryItem,
    description: string,
    entryDate: string,
    cubeControl: number) {
    const itemToAdd: ILedgerEntryItem = this.mapEntryItemToLedgerEntryItem(item);

    /* let basket = this.getCurrentBasketValue();
    if (basket === null) {
      this.createBasket();
    } */
    // above on older typescript does the same as line below!
    const ledgerEntry = this.getCurrentLedgerEntryValue() ?? this.createLedgerEntry();

    ledgerEntry.items = this.addOrUpdateItem(ledgerEntry.items, itemToAdd);
    ledgerEntry.description = description;
    ledgerEntry.entryDate = entryDate;
    ledgerEntry.cubeControl = cubeControl;
    this.setLedgerEntry(ledgerEntry);
  }

  private calculateCubeAmount() {
    const ledgerEntry = this.getCurrentLedgerEntryValue();

    let cubeAmount = 0;
    let counter = 0;
    while (counter < ledgerEntry.items.length) {
      const value = ledgerEntry.items[counter].amount;
      const dcOption = ledgerEntry.items[counter].dcOption;
      switch (dcOption) {
        case 'D':
          cubeAmount = cubeAmount + value;
          break; // debit

        case 'C':
          cubeAmount = cubeAmount - value;
          break; // credit

        case 'T':
          break; // with t bookingnumber nothing to do
      }
      counter++;
    }
    const ctrlSolde = cubeAmount;
    this.ledgerEntrySoldeSource.next({ ctrlSolde })
  }

  private addOrUpdateItem(items: ILedgerEntryItem[], itemToAdd: ILedgerEntryItem): ILedgerEntryItem[] {
    const index = items.findIndex(i => i.id === itemToAdd.id);
    if (index === -1) {
      items.push(itemToAdd);
    } else {
      items[index].dcOption = itemToAdd.dcOption;
      items[index].amount = itemToAdd.amount;
      items[index].account = itemToAdd.account;
      items[index].tAccount = itemToAdd.tAccount;
    }
    return items;
  }

  private mapEntryItemToLedgerEntryItem(item: ILedgerEntryItem): ILedgerEntryItem {
    return {
      id: item.id,
      dcOption: item.dcOption,
      amount: item.amount,
      account: item.account,
      tAccount: item.tAccount
    }
  }

  removeItemFromLedgerEntry(item: ILedgerEntryItem) {
    const ledgerEntry = this.getCurrentLedgerEntryValue();
    if (ledgerEntry.items.some(x => x.id === item.id)) {
      ledgerEntry.items = ledgerEntry.items.filter(i => i.id !== item.id);
      if (ledgerEntry.items.length > 0) {
        this.setLedgerEntry(ledgerEntry);
      } else {
        this.calculateCubeAmount();
        this.deleteLedgerEntry(ledgerEntry);
      }
    }
  }

  removeAllItemsFromLedgerEntry() {
    const ledgerEntry = this.getCurrentLedgerEntryValue();
    this.deleteLedgerEntry(ledgerEntry);
  }

  deleteLedgerEntry(ledgerEntry: ILedgerEntry) {
    // LOCALSTORE !!
    return this.http
      .get('assets/dummy.txt', {
        responseType: 'text',
      })
      .subscribe(() => {
        this.ledgerEntrySource.next(null);
        localStorage.removeItem('ledgerEntry_id');
        localStorage.removeItem(ledgerEntry.id);
      });

    // REDIS !!
    /* return this.http
        .delete(this.baseUrl + 'ledgerentry?id=' + basket.id).subscribe(() => {
          this.basketSource.next(null);
          localStorage.removeItem('ledgerEntry_id');
        }, error => {
          console.log(error);
      }); */
  }
}
