import { Routes } from '@angular/router';
import { Recipes } from './pages/recipes/recipes';

import { Recipes as RecipesManager } from './pages/profile/manager/recipes/recipes';
import { Error } from './pages/error/error';
import { SignIn } from './pages/sign-in/sign-in';
import { SignUp } from './pages/sign-up/sign-up';

import { ViewRecipe } from './pages/recipes/view-recipe/view-recipe';
import { Profile } from './pages/profile/profile';

import { Favorites } from './pages/profile/favorites/favorites';
import { Manager } from './pages/profile/manager/manager';
import { Categories } from './pages/profile/manager/categories/categories';
import { Ingredients } from './pages/profile/manager/ingredients/ingredients';
import { AddRecipe } from './pages/profile/manager/recipes/add-recipe/add-recipe';
import { AuthGuard } from './shared/guards/auth.guard';
import { GuestGuard } from './shared/guards/ghuest.guard';
import { General } from './pages/profile/general/general';
import { Changepassword } from './pages/profile/changepassword/changepassword';
import { AdminGuard } from './shared/guards/admin.guard';
import { Pages } from './pages/pages';
import { Dashboard } from './dashboard/dashboard';

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
          { path: 'favorites', component: Favorites },

          // Manager aloldalak
          {
            path: 'manager',
            component: Manager,
            children: [
              { path: '', redirectTo: 'recipes', pathMatch: 'full' },
              {
                path: 'recipes',
                children: [
                  { path: '', component: RecipesManager },
                  { path: 'add', component: AddRecipe },
                  { path: 'edit/:id', component: AddRecipe },
                ],
              },
              { path: 'categories', component: Categories },
              { path: 'ingredients', component: Ingredients },
            ],
          },
        ],
      },

      { path: 'error', component: Error },
      { path: 'signin', component: SignIn, canActivate: [GuestGuard] },
      { path: 'signup', component: SignUp, canActivate: [GuestGuard] },
      { path: '', redirectTo: '/recipes', pathMatch: 'full' },
    ],
  },
  { path: 'dashboard', component: Dashboard },
  { path: '**', redirectTo: '/error', pathMatch: 'full' },
];
