import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../shared/services/user-service';
import { IUserList } from '@recipe/shared';
import { toSignal } from '@angular/core/rxjs-interop';
import { InfiniteScroll } from '../../../components/infinite-scroll/infinite-scroll';
import { ConfirmModal } from '../../../components/confirm-modal/confirm-modal';
import { Spinner } from '../../../components/spinner/spinner';
import { ProfilePicture } from '../../../components/profile-picture/profile-picture';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-users',
  imports: [RouterLink, InfiniteScroll, ConfirmModal, Spinner, ProfilePicture, DatePipe],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  isConfirmModalShow = false;
  isOpenAddUserModal = false;
  selectedUser?: IUserList;

  public userService: UserService = inject(UserService);

  nameString = signal('');
  emailString = signal('');
  scrollSignal = signal(false);

  users = toSignal(this.userService.users$, { initialValue: [] });

  isShowDeleteConfirm = signal(false);

  // Computed view model
  vm = computed(() => ({
    nameString: this.nameString(),
    emailString: this.emailString(),
    users: this.users(),
    loading: this.userService.isLoading,
    hasResults: this.users().length > 0,
  }));

  constructor() {}

  ngOnInit(): void {
    this.userService.reset();
    this.loadNext();
  }

  private filterEffect = effect(() => {
    this.emailString();
    this.nameString();
    this.userService.reset();
    this.loadNext();
  });

  private scrollEffect = effect(() => {
    if (this.scrollSignal()) {
      this.loadNext();
      this.scrollSignal.set(false);
    }
  });

  loadMore(inf: InfiniteScroll) {
    this.scrollSignal.set(true);
    inf.done(); // reset loading flag
  }

  loadNext() {
    this.userService.loadNext(this.nameString(), this.emailString());
  }

  changeNameSearch(searchString: string) {
    this.nameString.set(searchString);
  }
  changeEmailSearch(searchString: string) {
    this.emailString.set(searchString);
  }

  showDeleteConfirm(user: IUserList) {
    this.selectedUser = user;
    this.isConfirmModalShow = true;
  }
  onConfirmModal(state: boolean) {
    if (this.selectedUser && state) {
      this.userService.delete(this.selectedUser.id);
    }
    this.isConfirmModalShow = false;
  }
}
