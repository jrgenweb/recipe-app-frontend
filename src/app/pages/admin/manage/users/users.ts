import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IUserList } from '@recipe/shared';

import { DatePipe } from '@angular/common';
import { InfiniteScroll } from '../../../../components/infinite-scroll/infinite-scroll';
import { ConfirmModal } from '../../../../components/confirm-modal/confirm-modal';
import { Spinner } from '../../../../components/spinner/spinner';
import { ProfilePicture } from '../../../../components/profile-picture/profile-picture';
import { AdminUserStore } from '../../../../features/admin/features/users/stores/user.store';

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

  public userStore = inject(AdminUserStore);

  isShowDeleteConfirm = signal(false);

  constructor() {}

  ngOnInit(): void {
    this.userStore.loadAll();
  }

  loadMore(inf: InfiniteScroll) {
    this.userStore.loadNext();
    inf.done(); // reset loading flag
  }

  changeNameSearch(name: string) {
    this.userStore.updateFilters({ name });
  }
  changeEmailSearch(email: string) {
    this.userStore.updateFilters({ email });
  }

  showDeleteConfirm(user: IUserList) {
    this.selectedUser = user;
    this.isConfirmModalShow = true;
  }
  onConfirmModal(state: boolean) {
    if (this.selectedUser && state) {
      this.userStore.delete(this.selectedUser.id);
    }
    this.isConfirmModalShow = false;
  }
}
