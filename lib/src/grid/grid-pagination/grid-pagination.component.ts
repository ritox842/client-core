/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { AgGridEvent, ColumnApi, GridApi } from 'ag-grid';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';

interface Translations {
  of: string;
  items: string;
}

@TakeUntilDestroy()
@Component({
  selector: 'dato-grid-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './grid-pagination.component.html',
  styleUrls: ['./grid-pagination.component.scss']
})
export class DatoGridPaginationComponent implements OnInit, OnDestroy {
  destroyed$: Observable<boolean>;

  // number of rows in the table
  private rowCount: number;
  private rowsPerPage: number;
  private translations: Partial<Translations> = {};
  // how many numbers are showing on the same time besides the last page number
  private _pagesInView: number;
  // The number of pages displayed on each side of the selected page.
  private pagesOnSides: number;
  // if the number of pages in the table fits the number of displaying pages
  private pagesFitView: boolean;
  // how many numbers to show on each side besides the selected number
  private navigationElement: ElementRef;
  // The number of pages displayed in the navigation panel for each view as defined by product.
  private readonly MINI_DISPLAY_LENGTH: number = 2;
  private readonly DISPLAY_LENGTH: number = 5;
  // Widget's width the determines the pagination view type [ small, xs] as defined by product.
  private readonly XS_DISPLAY_SIZE: number = 160;
  private readonly SMALL_DISPLAY_SIZE: number = 390;

  /** The ag-grid api */
  @Input() agGridApi: GridApi;
  /** The ag-grid column api */
  @Input() agGridColumnApi: ColumnApi;
  /** update the expand collapse item according to the table state */
  @Input() isCollapsed: boolean;
  /** Whether to shot the Fit-To-Content button */
  @Input() showFitToContent = true;

  @Input() rowDataChanged: Subject<AgGridEvent>;

  /** bubble fit to container event */
  @Output() fitToContainer: EventEmitter<any> = new EventEmitter();
  /** bubble fit to content event */
  @Output() fitToContent: EventEmitter<any> = new EventEmitter();
  /** bubble grouped row expand collapse */
  @Output() toggleRowGroup: EventEmitter<any> = new EventEmitter();

  /**
   * This setter is used to assign the navigation element ref and to set
   * the pagination size when the component starts
   * @param {ElementRef} content
   */
  @ViewChild('navigation')
  set content(content: ElementRef) {
    this.navigationElement = content;
    if (content && this.smallVersion === null) {
      this.calculateNavigationSize();
    }
  }

  get prevPageDisabled() {
    return this.pageNumbersDisplay.currentPage === 1;
  }

  get nextPageDisabled() {
    return this.pageNumbersDisplay.currentPage === this.totalPages;
  }

  ngOnInit() {
    this.rowDataChanged.pipe(takeUntil(this.destroyed$)).subscribe((event: AgGridEvent) => {
      this.calcPagination(event);
    });
  }

  /**
   *
   * @param {AgGridEvent} gridApi
   */
  private calcPagination(gridApi: AgGridEvent) {
    this.showCollapseExpand = gridApi.columnApi.isPivotMode() && this.agGridColumnApi.getRowGroupColumns().length > 1;

    // The length of the pages starting from 1
    this.totalPages = gridApi.api.paginationGetTotalPages();

    this.rowCount = gridApi.api.paginationGetRowCount();

    this.rowsPerPage = gridApi.api.paginationGetPageSize();

    // Set the init value of the pagination view to normal size
    this.pagesInView = this.DISPLAY_LENGTH;

    // Current page index starts from 0
    if (this.agGridApi) {
      this.navigatePage(0);
    }
    this.changeDetector.detectChanges();
  }

  /**
   * Set the number of page numbers showing at the same time in the navigation
   * panel & update the number of pages displayed on each side of the selected page.
   * @param {number} newNumbersLength - The new length of the displaying numbers
   */
  set pagesInView(newNumbersLength: number) {
    this._pagesInView = newNumbersLength;
    this.pagesOnSides = Math.floor(this._pagesInView / 2);
    this.pagesFitView = this._pagesInView + 1 >= this.totalPages;
    // invalidate displaying pages upon resize
    this.pageNumbersDisplay.pages = [];
  }

  // when the widget's width is smaller than XS_DISPLAY_SIZE disable go to first/last buttons
  disableButtons: boolean = null;
  // when the widget's width is smaller than SMALL_DISPLAY_SIZE change to small pagination view
  smallVersion: boolean | null = null;
  // number of pages in the table
  totalPages: number;
  // Is the table cross tab table
  showCollapseExpand = false;
  // The display rows range
  rowsRange: string;
  // managing object for the navigation
  pageNumbersDisplay: any = {
    currentPage: 0,
    pages: [],
    showFirstEllipsis: false,
    showLastPage: false
  };

  constructor(private changeDetector: ChangeDetectorRef) {
    // TODO: replace with a real translation
    this.translations.of = 'Of';
    this.translations.items = 'Items';
  }

  /**
   * Updates the pagination size according to the container.
   * This function is being called when the element's instance is being updated and when
   * we call the reflow function.
   */
  calculateNavigationSize() {
    if (this.navigationElement) {
      const elementWidth = this.navigationElement.nativeElement.parentElement.clientWidth;
      this.disableButtons = elementWidth < this.XS_DISPLAY_SIZE;
      const navigateTo = this.pageNumbersDisplay.currentPage - 1;
      if (elementWidth < this.SMALL_DISPLAY_SIZE) {
        if (this._pagesInView !== this.MINI_DISPLAY_LENGTH) {
          this.smallVersion = true;
          this.pagesInView = this.MINI_DISPLAY_LENGTH;
          this.navigatePage(navigateTo);
        }
      } else {
        if (this._pagesInView !== this.DISPLAY_LENGTH) {
          this.smallVersion = false;
          this.pagesInView = this.DISPLAY_LENGTH;
          this.navigatePage(navigateTo);
        }
      }
      this.changeDetector.detectChanges();
    }
  }

  /**
   * Navigates to a given page.
   * updates the displaying page numbers and the current number.
   * @param pageNumber - The page number to navigate to
   */
  navigatePage(pageNumber) {
    if (pageNumber >= 0 && pageNumber <= this.totalPages - 1) {
      this.agGridApi.paginationGoToPage(pageNumber);
      // Add 1 because ag-grid API works with first index 0
      const displayNumber = pageNumber + 1;
      this.pageNumbersDisplay.currentPage = displayNumber;

      if (this.pageNumbersDisplay.pages.length === 0 || !this.pagesFitView) {
        this.pageNumbersDisplay.pages = this.getPages(displayNumber);
      }
    }

    // Set the displaying rows range
    this.setRowsDisplayRange(pageNumber);
  }

  /**
   * updates the displaying page numbers to show the next numbers set
   */
  showNextBatch() {
    const anchor = this.pageNumbersDisplay.pages[0] + this._pagesInView + this.pagesOnSides;
    this.pageNumbersDisplay.pages = this.getPages(anchor);
  }

  /**
   * updates the displaying page numbers to show the previous numbers set
   */
  showPreviousBatch() {
    const anchor = this.pageNumbersDisplay.pages[0] - this._pagesInView + this.pagesOnSides;
    this.pageNumbersDisplay.pages = this.getPages(anchor);
  }

  /**
   * resize the columns width to fit their content if the columns width is smaller
   * than the container the grid will fir the container.
   */
  bubbleFitToContainerEvent() {
    this.fitToContainer.emit();
  }

  /**
   * resize the columns width to fit their content if the columns width is smaller
   * than the container the grid will fir the container.
   */
  bubbleFitToContentEvent() {
    this.fitToContent.emit();
  }

  /**
   * Expand/Collapse the grouped rows
   */
  toggleExpand() {
    this.toggleRowGroup.emit();
  }

  /**
   * The trackBy function for the ngFor
   * @param index - current item index
   * @param page - the current item's page number
   * @return {number}
   */
  trackByFunc(index: number, page: number) {
    return page;
  }

  ngOnDestroy(): void {}

  /**
   * Sets the rows display string
   * @param pageNumber - The current page number (starting index 0)
   * @private
   */
  private setRowsDisplayRange(pageNumber): void {
    const firstRowIndex = 1 + pageNumber * this.rowsPerPage;
    const lastRow = (pageNumber + 1) * this.rowsPerPage;
    const lastRowIndex = this.rowCount > lastRow ? lastRow : this.rowCount;
    this.rowsRange = `${firstRowIndex} - ${lastRowIndex} ${this.translations.of} ${this.rowCount} ${this.translations.items}`;
  }

  /**
   * Gets a number and returns an array of the displaying numbers.
   * @param anchor - The number to use as an anchor for the calculations.
   * @return {number[]} - An array of the new numbers to display
   * @private
   */
  private getPages(anchor: number): number[] {
    const pagesToDisplay = [];
    // indicates rather the table has more pages than the display length, we add 1 because of
    // a logic that says that if your current view is 1 number away from the last page
    // display him as well.
    this.pageNumbersDisplay.showLastPage = !this.pagesFitView && anchor + this.pagesOnSides < this.totalPages;
    this.pageNumbersDisplay.showFirstEllipsis = !this.pagesFitView && anchor - this.pagesOnSides > 1;

    // set the first number to be displayed
    const firstNumber = this.getFirstPageNumber(anchor);
    const loopLength = this.pagesFitView ? this.totalPages : this._pagesInView;
    for (let i = 0; i < loopLength; i++) {
      pagesToDisplay.push(firstNumber + i);
    }
    // If the last displayed number is 1 number before the last page display him as well
    if (!this.smallVersion && pagesToDisplay[loopLength - 1] + 1 === this.totalPages) {
      pagesToDisplay.push(this.totalPages);
      this.pageNumbersDisplay.showLastPage = false;
    }
    return pagesToDisplay;
  }

  /**
   * Returns the first number to be displayed in the pagination navigation view
   * @param {number} anchor - The anchor for the calculations
   * @return {number} - The first number to be displayed
   * @private
   */
  private getFirstPageNumber(anchor: number): number {
    let firstNumber = anchor - this.pagesOnSides;
    // If in small version show only next page so set first page to anchor
    if (this.smallVersion && anchor > 1) {
      if (anchor !== this.totalPages) {
        firstNumber = anchor;
      }
    } else if (!this.pageNumbersDisplay.showFirstEllipsis) {
      firstNumber = 1;
    } else if (!this.pageNumbersDisplay.showLastPage) {
      firstNumber = this.totalPages - (this._pagesInView - 1);
    }
    return firstNumber;
  }
}
