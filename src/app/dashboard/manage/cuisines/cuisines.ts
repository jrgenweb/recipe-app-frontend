import { Component, computed, effect, inject, signal, OnInit } from '@angular/core';
import { InfiniteScroll } from '../../../components/infinite-scroll/infinite-scroll';
import { CuisinService, ICuisin } from '../../../shared/services/cuisine-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConfirmModal } from '../../../components/confirm-modal/confirm-modal';
import { Spinner } from '../../../components/spinner/spinner';
import { AddCuisinModal } from './add-cuisin-modal/add-cuisin-modal';

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
