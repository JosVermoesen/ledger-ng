import { Component, OnInit } from '@angular/core';
import { LedgerEntryService } from './modules/ledger-entry/services/ledgerEntry.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private ledgerEntryService: LedgerEntryService) { }

  ngOnInit(): void {
    // check open session for ledgerEntry
    const ledgerEntryId = localStorage.getItem('ledgerEntry_id');
    if (ledgerEntryId) {
      this.ledgerEntryService.getLedgerEntry(ledgerEntryId)
        .subscribe(() => {
          console.log('initialised ledgerEntry');
        }, error => {
          console.log('there is an error: ', error);
        });
    }
  }
}
