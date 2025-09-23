import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  //success message
  openSuccessSnackBar(message: string) {
    const config: MatSnackBarConfig = {
      duration: 3000,
      panelClass: ['success-snackbar'],
    };
    this.snackBar.open(message, 'Close', config);
  }

  //failed message
  openFailedSnackBar(error: string) {
    const config: MatSnackBarConfig = {
      duration: 4000,
      panelClass: ['failed-snackbar'],
    };
    this.snackBar.open(error, 'Close', config);
  }
}
