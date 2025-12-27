import { ModuleRegistry } from "ag-grid-community";
import {
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  RowSelectionModule,
  PaginationModule,
} from "ag-grid-community";

// Register required AG Grid modules
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  RowSelectionModule,
  PaginationModule,
]);
