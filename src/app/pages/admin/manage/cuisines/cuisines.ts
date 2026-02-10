import { Component, computed, effect, inject, signal, OnInit } from '@angular/core';

import { toSignal } from '@angular/core/rxjs-interop';
import { InfiniteScroll } from '../../../../components/infinite-scroll/infinite-scroll';
import { ConfirmModal } from '../../../../components/confirm-modal/confirm-modal';
import { Spinner } from '../../../../components/spinner/spinner';
import { AddCuisinModal } from '../../../../features/admin/features/cuisines/components/add-cuisin-modal/add-cuisin-modal';
import {
  CuisinService,
  ICuisin,
} from '../../../../features/admin/features/cuisines/services/cuisine-service';

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

  public cuisinService: CuisinService = inject(CuisinService);

  searchString = signal('');
  scrollSignal = signal(false);

  cuisines = toSignal(this.cuisinService.cuisines$, { initialValue: [] });

  isShowDeleteConfirm = signal(false);

  // Computed view model
  vm = computed(() => ({
    searchString: this.searchString(),
    cuisines: this.cuisines(),
    loading: this.cuisinService.isLoading,
    hasResults: this.cuisines().length > 0,
  }));

  constructor() {}

  ngOnInit(): void {
    this.cuisinService.reset();
    this.loadNext();
  }

  private filterEffect = effect(() => {
    this.searchString();
    this.cuisinService.reset();
    this.loadNext();
  });
  // 🔥 Effect a scroll signal-re
  private scrollEffect = effect(() => {
    if (this.scrollSignal()) {
      this.loadNext();
      this.scrollSignal.set(false); // reset jelzés
    }
  });

  loadMore(inf: InfiniteScroll) {
    this.scrollSignal.set(true);
    inf.done(); // reset loading flag
  }

  loadNext() {
    this.cuisinService.loadNext(this.searchString());
  }

  changeSearchString(searchString: string) {
    this.searchString.set(searchString);
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
      this.cuisinService.delete(this.selectedCuisin.id);
    }
    this.isConfirmModalShow = false;
  }
}
