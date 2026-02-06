import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination implements OnInit {
  @Input() pageSize = 20;
  @Input() total!: number;
  @Input() page = 1; // 1-based index

  @Output() pageChange = new EventEmitter<{ skip: number; take: number; page: number }>();

  ngOnInit(): void {
    console.log(this.pageSize, this.total);
  }
  get totalPages(): number {
    return Math.ceil(this.total / this.pageSize);
  }

  // számoljuk ki a page-eket a Bootstrap paginationhoz
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages) return;

    const skip = (p - 1) * this.pageSize;
    const take = this.pageSize;

    this.pageChange.emit({ skip, take, page: p });
  }
}
