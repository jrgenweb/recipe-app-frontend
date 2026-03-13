# Recipe App (Angular + Bootstrap 5)

A full-featured recipe application built with Angular and Bootstrap 5.
Includes favorites, reviews, comments, admin panel, ingredient search, infinite scroll, and role-based guards.

## Tech stack

- Frontend: Angular 21 + Bootstrap 5
- State management: Signal Store
- Backend: NestJS (separate repository)
- Database: PostgreSQL / SQLite
- 
## Live demo
The frontend is hosted on Vercel: [link](https://recipe-app-frontend-three-black.vercel.app/recipes)

⚠️ Note: The live demo requires the backend to be running. Without it, the app won't display recipes.


## Setup locally

1. Clone frontend repo:
git clone https://github.com/jrgenweb/recipe-app-frontend.git

2. Install dependencies:
```bash
    cd recipe-app-frontend
    npm install
    ng serve
```

3. Make sure backend is running (from its repo):
https://github.com/jrgenweb/recipe-app-backend

4. Configure environment variables:
- Copy `.env.example` to `.env` and adjust API_URL
  
## Features
- Recipe search (by name or ingredients)
- Recipe details page
- Favorites
- Reviews & comments
- Infinite scroll with spinner
- Admin panel (CRUD)
- Role-based guards
- Signal Store for global state

## Notes / Tips

- Render free tier may cause cold start (~20-30s)
- Backend must be running for the app to function
- Recommended to start backend first, then frontend