import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { of, catchError, map } from 'rxjs';
import { SnackbarService } from '../../../services/snackbar.service';
import { HighlightService } from '../../../services/highlight.service';
import { Highlight } from '../../../models/highlight.model';
import { ApiResponse } from '../../../utils/apiresponse';

@Component({
  selector: 'app-highlight',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
  ],
  providers: [DatePipe],
  templateUrl: './highlight.component.html',
  styleUrls: ['./highlight.component.css'],
})
export class HighlightComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['srNo', 'description', 'createdAt', 'action'];
  dataSource = new MatTableDataSource<Highlight>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild('addHighlightDialog')
  addHighlightDialogTemplate!: TemplateRef<any>;
  @ViewChild('editHighlightDialog')
  editHighlightDialogTemplate!: TemplateRef<any>;
  @ViewChild('deleteDialog') deleteDialogTemplate!: TemplateRef<any>;

  dialogRef!: MatDialogRef<any>;
  addHighlightForm!: FormGroup;
  editHighlightForm!: FormGroup;
  selectedHighlightId: number | null = null;

  constructor(
    private highlightService: HighlightService,
    private snackbar: SnackbarService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadHighlights();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private initForms(): void {
    this.addHighlightForm = this.fb.group({
      description: ['', Validators.required],
    });

    this.editHighlightForm = this.fb.group({
      id: [0],
      description: ['', Validators.required],
    });
  }

  loadHighlights(): void {
    this.highlightService
      .getAllHighlights()
      .pipe(
        map((res: ApiResponse<Highlight[]>) => res.data),
        catchError(() => {
          this.snackbar.openFailedSnackBar('Failed to load highlights');
          return of([]);
        })
      )
      .subscribe((data) => {
        this.dataSource.data = data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }

  openAddHighlightDialog(): void {
    this.addHighlightForm.reset();
    this.dialogRef = this.dialog.open(this.addHighlightDialogTemplate, {
      width: '500px',
      disableClose: true,
    });
  }

  saveNewHighlight(): void {
    if (this.addHighlightForm.valid) {
      this.highlightService
        .createHighlight(this.addHighlightForm.value)
        .pipe(
          catchError(() => {
            this.snackbar.openFailedSnackBar('Failed to create highlight');
            return of(null);
          })
        )
        .subscribe((res) => {
          if (res && res.success) {
            this.snackbar.openSuccessSnackBar('Highlight added successfully');
            this.loadHighlights();
            this.closeDialog();
          }
        });
    }
  }

  openEditHighlightDialog(highlight: Highlight): void {
    this.selectedHighlightId = highlight.id;
    this.editHighlightForm.patchValue({
      id: highlight.id,
      description: highlight.description,
    });
    this.dialogRef = this.dialog.open(this.editHighlightDialogTemplate, {
      width: '500px',
      disableClose: true,
    });
  }

  updateHighlight(): void {
    if (this.editHighlightForm.valid && this.selectedHighlightId !== null) {
      const dto = this.editHighlightForm.value;
      this.highlightService
        .updateHighlight(this.selectedHighlightId, dto)
        .pipe(
          catchError(() => {
            this.snackbar.openFailedSnackBar('Failed to update highlight');
            return of(null);
          })
        )
        .subscribe((res) => {
          if (res && res.success) {
            this.snackbar.openSuccessSnackBar('Highlight updated successfully');
            this.loadHighlights();
            this.closeDialog();
          }
        });
    }
  }

  openDeleteDialog(id: number): void {
    this.selectedHighlightId = id;
    this.dialogRef = this.dialog.open(this.deleteDialogTemplate, {
      width: '400px',
      disableClose: true,
    });
  }

  confirmDelete(): void {
    if (this.selectedHighlightId !== null) {
      this.highlightService
        .deleteHighlight(this.selectedHighlightId)
        .pipe(
          catchError(() => {
            this.snackbar.openFailedSnackBar('Failed to delete highlight');
            return of(null);
          })
        )
        .subscribe((res) => {
          if (res && res.success) {
            this.snackbar.openSuccessSnackBar('Highlight deleted successfully');
            this.loadHighlights();
            this.closeDialog();
          }
        });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

 formatDateTime(date: string): string {
    return this.datePipe.transform(date, 'd MMM yyyy, h:mm a') || '';
  }
}
