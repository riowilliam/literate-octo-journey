import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [CommonModule],
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

  currentPage = 1;
  itemsPerPage = 10;
  pageRange = 5;
  isLoading = false;

  get paginatedRows() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.rows.slice(startIndex, endIndex);
  }

  get totalPages() {
    return Math.ceil(this.rows.length / this.itemsPerPage);
  }

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

  async goToPage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.isLoading = true;
      await this.loadPage(page);
      this.isLoading = false;
    }
  }

  async nextPage() {
    if (this.currentPage < this.totalPages) {
      this.isLoading = true;
      await this.loadPage(this.currentPage + 1);
      this.isLoading = false;
    }
  }

  async prevPage() {
    if (this.currentPage > 1) {
      this.isLoading = true;
      await this.loadPage(this.currentPage - 1);
      this.isLoading = false;
    }
  }

  async goToFirstPage() {
    this.isLoading = true;
    await this.loadPage(1);
    this.isLoading = false;
  }

  async goToLastPage() {
    this.isLoading = true;
    await this.loadPage(this.totalPages);
    this.isLoading = false;
  }

  private async loadPage(page: number) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.currentPage = page;
  }
}
