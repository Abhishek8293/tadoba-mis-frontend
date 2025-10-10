import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { DatePipe } from '@angular/common';
import { NoticeService } from '../../../services/notice.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { Notice } from '../../../models/notice.model';
import { ApiResponse } from '../../../utils/apiresponse';

@Component({
  selector: 'app-notice',
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
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.css'],
  providers: [DatePipe],
})
export class NoticeComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['srNo', 'description', 'createdAt', 'action'];
  dataSource = new MatTableDataSource<Notice>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild('addNoticeDialog') addNoticeDialogTemplate!: TemplateRef<any>;
  @ViewChild('editNoticeDialog') editNoticeDialogTemplate!: TemplateRef<any>;
  @ViewChild('deleteDialog') deleteDialogTemplate!: TemplateRef<any>;

  dialogRef!: MatDialogRef<any>;
  addNoticeForm!: FormGroup;
  editNoticeForm!: FormGroup;

  selectedNoticeId: number | null = null;

  constructor(
    private noticeService: NoticeService,
    private snackbar: SnackbarService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadNotices();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private initForms(): void {
    this.addNoticeForm = this.fb.group({
      description: ['', Validators.required],
    });

    this.editNoticeForm = this.fb.group({
      id: [0],
      description: ['', Validators.required],
    });
  }

  loadNotices(): void {
    this.noticeService
      .getAllNotices()
      .pipe(
        map((res: ApiResponse<Notice[]>) => res.data),
        catchError(() => {
          this.snackbar.openFailedSnackBar('Failed to load notices');
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

  openAddNoticeDialog(): void {
    this.addNoticeForm.reset();
    this.dialogRef = this.dialog.open(this.addNoticeDialogTemplate, {
      width: '500px',
      disableClose: true,
    });
  }

  saveNewNotice(): void {
    if (this.addNoticeForm.valid) {
      this.noticeService
        .createNotice(this.addNoticeForm.value)
        .pipe(
          catchError(() => {
            this.snackbar.openFailedSnackBar('Failed to create notice');
            return of(null);
          })
        )
        .subscribe((res) => {
          if (res && res.success) {
            this.snackbar.openSuccessSnackBar('Notice added successfully');
            this.loadNotices();
            this.closeDialog();
          }
        });
    }
  }

  openEditNoticeDialog(notice: Notice): void {
    this.selectedNoticeId = notice.id;
    this.editNoticeForm.patchValue({
      id: notice.id,
      description: notice.description,
    });
    this.dialogRef = this.dialog.open(this.editNoticeDialogTemplate, {
      width: '500px',
      disableClose: true,
    });
  }

  updateNotice(): void {
    if (this.editNoticeForm.valid && this.selectedNoticeId !== null) {
      const dto = this.editNoticeForm.value;
      this.noticeService
        .updateNotice(this.selectedNoticeId, dto)
        .pipe(
          catchError(() => {
            this.snackbar.openFailedSnackBar('Failed to update notice');
            return of(null);
          })
        )
        .subscribe((res) => {
          if (res && res.success) {
            this.snackbar.openSuccessSnackBar('Notice updated successfully');
            this.loadNotices();
            this.closeDialog();
          }
        });
    }
  }

  openDeleteDialog(id: number): void {
    this.selectedNoticeId = id;
    this.dialogRef = this.dialog.open(this.deleteDialogTemplate, {
      width: '400px',
      disableClose: true,
    });
  }

  confirmDelete(): void {
    if (this.selectedNoticeId !== null) {
      this.noticeService
        .deleteNotice(this.selectedNoticeId)
        .pipe(
          catchError(() => {
            this.snackbar.openFailedSnackBar('Failed to delete notice');
            return of(null);
          })
        )
        .subscribe((res) => {
          if (res && res.success) {
            this.snackbar.openSuccessSnackBar('Notice deleted successfully');
            this.loadNotices();
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
