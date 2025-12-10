import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NoticeService } from '../../../services/notice.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { ApiResponse } from '../../../utils/apiresponse';
import { Notice } from '../../../models/notice.model';
import { map, catchError, of } from 'rxjs';

@Component({
  selector: 'app-emp-notice',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  providers: [DatePipe],
  templateUrl: './emp-notice.component.html',
  styleUrls: ['./emp-notice.component.css'],
})
export class EmpNoticeComponent implements OnInit {
  latestNotices: Notice[] = [];

  constructor(
    private noticeService: NoticeService,
    private snackbar: SnackbarService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadNotices();
  }

  loadNotices(): void {
    this.noticeService
      .getAllNotices()
      .pipe(
        map((res: ApiResponse<Notice[]>) =>
          res.data
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .slice(0, 8)
        ),
        catchError(() => {
          this.snackbar.openFailedSnackBar('Failed to load notices');
          return of([]);
        })
      )
      .subscribe((data) => (this.latestNotices = data));
  }

  formatDateTime(date: string): string {
    return this.datePipe.transform(date, 'd MMM yyyy, h:mm a') || '';
  }
}
