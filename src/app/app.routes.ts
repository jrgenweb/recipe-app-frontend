import { Routes } from '@angular/router';
import { Recipes } from './pages/recipes/recipes';

import { Recipes as RecipesManager } from './pages/profile/recipes/recipes';
import { Error } from './pages/error/error';
import { SignIn } from './pages/auth/sign-in/sign-in';
import { SignUp } from './pages/auth/sign-up/sign-up';

import { ViewRecipe } from './pages/recipes/view-recipe/view-recipe';
import { Profile } from './pages/profile/profile';

import { Favorites } from './pages/profile/favorites/favorites';

import { AddRecipe } from './pages/profile/recipes/add-recipe/add-recipe';
import { AuthGuard } from './shared/guards/auth.guard';
import { GuestGuard } from './shared/guards/ghuest.guard';
import { General } from './pages/profile/general/general';
import { Changepassword } from './pages/profile/changepassword/changepassword';

import { Pages } from './pages/pages';
import { Dashboard } from './pages/admin/dashboard';
import { roleGuard } from './shared/guards/role.guard';
import { Delete } from './pages/profile/delete/delete';
import { Summary } from './pages/admin/summary/summary';

import { Ingredients as AdminIngredients } from './pages/admin/manage/ingredients/ingredients';
import { Categories as AdminCategories } from './pages/admin/manage/categories/categories';
import { Recipes as AdminRecipes } from './pages/admin/manage/recipes/recipes';
import { AddRecipe as AdminAddRecipe } from './pages/admin/manage/recipes/add-recipe/add-recipe';
import { Manage } from './pages/admin/manage/manage';
import { Users as AdminUsers } from './pages/admin/manage/users/users';
import { AddUser as AdminAddUser } from './pages/admin/manage/users/add-user/add-user';
import { Cuisines as AdminCuisines } from './pages/admin/manage/cuisines/cuisines';
import { Role } from '@recipe/shared';

export const routes: Routes = [
  {
    path: '',
    component: Pages,
    children: [
      {
        path: 'recipes',

        children: [
          { path: '', component: Recipes },

          { path: ':id', component: ViewRecipe },
        ],
      },

      {
        path: 'profile',
        component: Profile, // Mindig betöltődik a tab menüvel
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'general', pathMatch: 'full' }, // alapértelmezett tab
          { path: 'general', component: General },
          { path: 'change-password', component: Changepassword },
          { path: 'delete-profile', component: Delete },
          { path: 'favorites', component: Favorites },
          {
            path: 'recipes',
            children: [
              { path: '', component: RecipesManager },
              { path: 'add', component: AddRecipe },
              { path: 'edit/:id', component: AddRecipe },
            ],
          },
          // Manager aloldalak
        ],
      },

      { path: 'error', component: Error },
      { path: 'signin', component: SignIn, canActivate: [GuestGuard] },
      { path: 'signup', component: SignUp, canActivate: [GuestGuard] },
      { path: '', redirectTo: '/recipes', pathMatch: 'full' },
    ],
  },

  {
    path: 'dashboard',
    component: Dashboard,
    //canActivate: [roleGuard],
    //data: { role: Role.ADMIN },
    children: [
      { path: '', redirectTo: 'summary', pathMatch: 'full' },
      {
        path: 'summary',
        component: Summary,
      },

      {
        path: 'manage',
        component: Manage,
        children: [
          { path: '', redirectTo: 'users', pathMatch: 'full' },
          {
            path: 'users',
            children: [
              { path: '', component: AdminUsers },
              { path: 'add', component: AdminAddUser },
              { path: 'edit/:id', component: AdminAddUser },
            ],
          },
          {
            path: 'recipes',

            children: [
              { path: '', component: AdminRecipes },
              { path: 'add', component: AdminAddRecipe },
              { path: 'edit/:id', component: AdminAddRecipe },
            ],
          },
          { path: 'categories', component: AdminCategories },
          { path: 'ingredients', component: AdminIngredients },
          { path: 'cuisines', component: AdminCuisines },
        ],
      },
      { path: 'error', component: Error },
      { path: '**', redirectTo: 'error', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: '/error', pathMatch: 'full' },
];
