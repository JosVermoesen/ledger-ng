import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { LedgerEntryRoutingModule } from './ledger-entry-routing.module';
import { LedgerEntryComponent } from './ledger-entry.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LedgerEntryComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonsModule.forRoot(),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    LedgerEntryRoutingModule,
  ],
  providers: [],
})
export class LedgerEntryModule {}
