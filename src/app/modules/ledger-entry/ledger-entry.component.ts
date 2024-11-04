import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import moment from 'moment';

import { Observable } from 'rxjs';
import { ILedgerEntry, ILedgerEntryItem, ILedgerEntrySolde } from './models/ledgerEntry';
import { LedgerEntryService } from './services/ledgerEntry.service';
import { Guid } from 'src/app/functions/guid';

@Component({
  selector: 'app-ledger-entry',
  templateUrl: './ledger-entry.component.html',
  styleUrls: ['./ledger-entry.component.scss']
})
export class LedgerEntryComponent implements OnInit {
  ledgerEntryHeaderForm!: FormGroup;
  entryHeaderLocked!: boolean;
  descriptionAsHeader!: string;
  dateAsHeader!: string;

  ledgerEntryForm!: FormGroup;

  btnAddOrEdit!: string;
  readyForBooking = false;
  totalSolde!: number;

  loaded = false;
  ledgerEntry$: Observable<ILedgerEntry> = null as any as Observable<ILedgerEntry>;
  ledgerEntryJson: ILedgerEntry = null as any as ILedgerEntry;
  selectedLedgerEntryItem!: ILedgerEntryItem;
  ledgerEntrySolde$: Observable<ILedgerEntrySolde> = null as any as Observable<ILedgerEntrySolde>;
selectedBasketItem: any;

  constructor(
    private ledgerEntryService: LedgerEntryService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.ledgerEntry$ = this.ledgerEntryService.ledgerEntry$;
    this.ledgerEntrySolde$ = this.ledgerEntryService.ledgerEntrySolde$;
    this.refreshLedgerEntry();

    const ledgerEntryId = localStorage.getItem('ledgerEntry_id');
    if (ledgerEntryId) {
      this.descriptionAsHeader = this.ledgerEntryJson.description;
      const ioDate = this.ledgerEntryJson.entryDate;
      const momentDate = moment(ioDate).format('YYYY-MM-DD');
      this.dateAsHeader = momentDate;
      this.entryHeaderLocked = true;
    } else {
      this.descriptionAsHeader = null as any as string;
      const momentDate = moment().format('YYYY-MM-DD');
      this.dateAsHeader = momentDate;
      this.entryHeaderLocked = false;
    }

    this.ledgerEntryHeaderForm = this.fb.group({
      description: [this.descriptionAsHeader, Validators.required],
      lDate: [this.dateAsHeader, Validators.required]
    });

    this.btnAddOrEdit = 'Add';
    this.clearState();
  }

  refreshLedgerEntry() {
    this.ledgerEntryJson = this.ledgerEntryService.getCurrentLedgerEntryValue();
    this.loaded = true;
  }

  onSubmit() {
    if (this.ledgerEntryForm.valid) {
      const ledgerEntryItem: ILedgerEntryItem = Object.assign(
        {},
        this.ledgerEntryForm.value
      );
      this.loaded = false;
      const entryDescription = this.ledgerEntryHeaderForm.value.description;
      const entryDate = this.ledgerEntryHeaderForm.value.lDate;

      this.ledgerEntryService.addItemToLedgerEntry(ledgerEntryItem, entryDescription, entryDate, -1);
    }
    this.refreshLedgerEntry();
    this.clearState();
  }

  clearState() {
    this.readyForBooking = false;

    this.ledgerEntryForm = this.fb.group({
      id: Guid(),
      dcOption: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      account: [
        null,
        [Validators.required, Validators.minLength(3), Validators.maxLength(7)]
      ],
      tAccount: [null]
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  checkBalance() { }

  onBooking() {
    if (confirm('Are you sure?')) {
      // send to redis API
    }
  }

  onSelect(item: ILedgerEntryItem) {
    // console.log(item);
    this.setForUpdate(item);
  }

  setForUpdate(item: ILedgerEntryItem) {
    // this.readyForBooking = false;

    this.ledgerEntryForm = this.fb.group({
      id: item.id,
      dcOption: [item.dcOption, Validators.required],
      amount: [item.amount, [Validators.required, Validators.min(0.01)]],
      account: [
        item.account,
        [Validators.required, Validators.minLength(3), Validators.maxLength(7)]
      ],
      tAccount: [item.tAccount]
    });
    this.btnAddOrEdit = 'Save';
  }

  removeSingleEntry(item: ILedgerEntryItem) {
    console.log(item);
    if (confirm('Are you sure?')) {
      this.loaded = false;
      this.ledgerEntryService.removeItemFromLedgerEntry(item);
      this.refreshLedgerEntry();
    }
  }

  getColor(option: string) {
    switch (option.substring(0, 1)) {
      case 'D':
        return 'blue'; // debit
  
      case 'C':
        return 'red'; // credit
  
      case 'T':
        return 'green'; // with t bookingnumber
  
      default:
        return ''; // default color
    }
  }

  removeAllEntries() {
    if (confirm('Are you sure?')) {
      this.ledgerEntryService.removeAllItemsFromLedgerEntry();
      
      this.refreshLedgerEntry();
    }
   }
}
