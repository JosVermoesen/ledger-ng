import { Component, inject, OnInit } from '@angular/core';
import { LedgerEntryService } from './modules/ledger-entry/services/ledgerEntry.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {
  ledgerEntryService = inject(LedgerEntryService);

  ngOnInit(): void {
    // check open session for ledgerEntry
    const ledgerEntryId = localStorage.getItem('ledgerEntry_id');
    if (ledgerEntryId) {
      this.ledgerEntryService.getLedgerEntry(ledgerEntryId).subscribe({
        next: () => {
          console.log('ledgerEntry initialised');
        },
        error: (error) => {
          console.log('there is an error: ', error);
        },
      });
    }
  }
}
