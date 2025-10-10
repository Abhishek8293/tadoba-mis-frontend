import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { HighlightService } from '../../../services/highlight.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { ApiResponse } from '../../../utils/apiresponse';
import { Highlight } from '../../../models/highlight.model';
import { map, catchError, of } from 'rxjs';

@Component({
  selector: 'app-emp-highlight',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  providers: [DatePipe],
  templateUrl: './emp-highlight.component.html',
  styleUrls: ['./emp-highlight.component.css'],
})
export class EmpHighlightComponent implements OnInit {
  latestHighlights: Highlight[] = [];

  constructor(
    private highlightService: HighlightService,
    private snackbar: SnackbarService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadHighlights();
  }

  loadHighlights(): void {
    this.highlightService
      .getAllHighlights()
      .pipe(
        map((res: ApiResponse<Highlight[]>) =>
          res.data
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .slice(0, 3)
        ),
        catchError(() => {
          this.snackbar.openFailedSnackBar('Failed to load highlights');
          return of([]);
        })
      )
      .subscribe((data) => (this.latestHighlights = data));
  }

  formatDateTime(date: string): string {
    return this.datePipe.transform(date, 'd MMM yyyy, h:mm a') || '';
  }
}
