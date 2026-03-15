import { Component, inject, signal, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { InfiniteScroll } from '../../../../components/infinite-scroll/infinite-scroll';
import { ConfirmModal } from '../../../../components/confirm-modal/confirm-modal';
import { Spinner } from '../../../../components/spinner/spinner';
import { AddCuisinModal } from '../../../../features/admin/features/cuisines/components/add-cuisin-modal/add-cuisin-modal';
import { ICuisin } from '../../../../features/admin/features/cuisines/services/admin-cuisine-service';
import { AdminCuisineStore } from '../../../../features/admin/features/cuisines/stores/admin-cuisine.store';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-cuisines',
  imports: [InfiniteScroll, ConfirmModal, Spinner, AddCuisinModal],
  templateUrl: './cuisines.html',
  styleUrl: './cuisines.scss',
})
export class Cuisines implements OnInit, OnDestroy {
  @ViewChild('inf') inf?: InfiniteScroll;
  isConfirmModalShow = false;
  isOpenAddCuisinModal = false;
  selectedCuisin?: ICuisin;

  public store = inject(AdminCuisineStore);

  searchString = signal('');
  scrollSignal = signal(false);

  isShowDeleteConfirm = signal(false);
  loadingSubscription$ = toObservable(this.store.isLoading).subscribe((loading) => {
    const allLoaded = this.store.cuisines().length >= this.store.total();
    if (!loading && !allLoaded && this.inf && !this.inf.loading) {
      requestAnimationFrame(() => this.inf!.checkAnchor());
    }
  });
  constructor() {}

  ngOnInit(): void {
    this.store.loadAll();
  }

  loadMore(inf: InfiniteScroll) {
    this.scrollSignal.set(true);
    inf.done(); // reset loading flag
  }

  changeSearchString(search: string) {
    this.store.updateFilters({ search });
  }
  openAddCuisinModal(cuisin?: ICuisin) {
    if (cuisin) {
      this.selectedCuisin = cuisin;
    } else {
      this.selectedCuisin = undefined;
    }
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
  ngOnDestroy() {
    this.loadingSubscription$.unsubscribe();
  }
}
