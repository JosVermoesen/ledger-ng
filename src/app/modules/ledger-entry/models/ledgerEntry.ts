import { Guid } from "src/app/functions/guid";

export interface ILedgerEntry {
  id: string;
  items: ILedgerEntryItem[];
  description: string;
  entryDate: string;
  cubeControl: number;
}

export interface ILedgerEntryItem {
  id: string;
  dcOption: string;
  amount: number;
  account: string;
  tAccount: string;
}

export class LedgerEntry implements ILedgerEntry {
  id = Guid();
  items: ILedgerEntryItem[] = [];
  description!: string;
  entryDate!: string;
  cubeControl!: number;
}

export interface ILedgerEntrySolde {
  ctrlSolde: number;
}
