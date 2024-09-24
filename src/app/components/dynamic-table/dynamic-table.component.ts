import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RupiahPipe } from '../../pipes/rupiah.pipe';

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [CommonModule, RupiahPipe],
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss'],
})
export class DynamicTableComponent {
  @Input() headers: {
    key: string;
    label: string;
    class?: string;
    renderType?: (
      value: any,
      row?: any
    ) =>
      | 'number'
      | 'text'
      | 'currency'
      | 'date'
      | 'integer'
      | 'button'
      | 'icon'
      | 'empty';
  }[] = [];
  @Input() rows: any[] = [];
  @Output() buttonClick = new EventEmitter<{ row: any; key: string }>();

  @Input() currentPage: number = 1;
  @Input() pageSize: number = 10;
  pageRange = 5;
  isLoading = false;
  @Input() totalPages: number = 0;
  @Output() buttonPagination = new EventEmitter<number>();
  @Input() hasFooter: boolean = true;

  get pageNumbers() {
    const pages = [];
    const totalPages = this.totalPages;

    let startPage = Math.max(
      1,
      this.currentPage - Math.floor(this.pageRange / 2)
    );
    let endPage = Math.min(totalPages, startPage + this.pageRange - 1);

    if (endPage - startPage + 1 < this.pageRange) {
      startPage = Math.max(1, endPage - this.pageRange + 1);
    }

    for (let page = startPage; page <= endPage; page++) {
      pages.push(page);
    }

    return pages;
  }

  onButtonClick(row: any, key: string) {
    this.buttonClick.emit({ row, key });
  }

  goToPage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.isLoading = true;
      this.loadPage(page);
      this.isLoading = false;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.isLoading = true;
      this.loadPage(this.currentPage + 1);
      this.isLoading = false;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.isLoading = true;
      this.loadPage(this.currentPage - 1);
      this.isLoading = false;
    }
  }

  goToFirstPage() {
    this.isLoading = true;
    this.loadPage(1);
    this.isLoading = false;
  }

  goToLastPage() {
    this.isLoading = true;
    this.loadPage(this.totalPages);
    this.isLoading = false;
  }

  loadPage(page: number) {
    this.buttonPagination.emit(page);
    this.currentPage = page;
  }
}
