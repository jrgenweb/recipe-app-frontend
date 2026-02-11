import { Component, inject, signal, OnInit } from '@angular/core';

import { InfiniteScroll } from '../../../../components/infinite-scroll/infinite-scroll';
import { ConfirmModal } from '../../../../components/confirm-modal/confirm-modal';
import { Spinner } from '../../../../components/spinner/spinner';
import { AddCuisinModal } from '../../../../features/admin/features/cuisines/components/add-cuisin-modal/add-cuisin-modal';
import { ICuisin } from '../../../../features/admin/features/cuisines/services/admin-cuisine-service';
import { AdminCuisineStore } from '../../../../features/admin/features/cuisines/stores/admin-cuisine.store';

@Component({
  selector: 'app-cuisines',
  imports: [InfiniteScroll, ConfirmModal, Spinner, AddCuisinModal],
  templateUrl: './cuisines.html',
  styleUrl: './cuisines.scss',
})
export class Cuisines implements OnInit {
  isConfirmModalShow = false;
  isOpenAddCuisinModal = false;
  selectedCuisin?: ICuisin;

  public store = inject(AdminCuisineStore);

  searchString = signal('');
  scrollSignal = signal(false);

  isShowDeleteConfirm = signal(false);

  constructor() {}

  ngOnInit(): void {
    this.changeFilter();
  }

  private changeFilter() {
    this.searchString();
    this.store.reset();
    this.store.loadAll(this.searchString());
  }

  loadMore(inf: InfiniteScroll) {
    this.scrollSignal.set(true);
    inf.done(); // reset loading flag
  }
  /* 
  loadNext() {
    this.cuisinService.loadNext(this.searchString());
  }
 */
  changeSearchString(searchString: string) {
    this.searchString.set(searchString);
    this.changeFilter();
  }
  openAddCuisinModal(cuisin?: ICuisin) {
    if (cuisin) this.selectedCuisin = cuisin;
    this.isOpenAddCuisinModal = true;
  }

  onCloseAddCuisinModal() {
    this.isOpenAddCuisinModal = false;
    this.selectedCuisin = undefined;
  }

  showDeleteConfirm(cuisin: ICuisin) {
    this.selectedCuisin = cuisin;
    this.isConfirmModalShow = true;
  }
  onConfirmModal(state: boolean) {
    if (this.selectedCuisin && this.selectedCuisin?.id && state) {
      this.store.delete(this.selectedCuisin.id);
    }
    this.isConfirmModalShow = false;
  }
}
