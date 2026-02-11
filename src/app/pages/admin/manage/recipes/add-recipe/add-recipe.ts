import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IRecipeIngredient } from '@recipe/shared';
import { IRecipeDetail } from '@recipe/shared';

import { ActivatedRoute, RouterLink } from '@angular/router';

import { AsyncPipe } from '@angular/common';
import { InfiniteScroll } from '../../../../../components/infinite-scroll/infinite-scroll';

import { RecipeService } from '../../../../../features/recipes/services/recipe-service';

import { asyncImageValidator } from '../../../../../shared/validators/async-image-validator';
import { AdminCategoryStore } from '../../../../../features/admin/features/categories/stores/admin-category.store';

import { AdminCuisineStore } from '../../../../../features/admin/features/cuisines/stores/admin-cuisine.store';
import { IngredientStore } from '../../../../../features/ingredients/stores/ingredient.store';

@Component({
  selector: 'app-add-recipe',
  imports: [ReactiveFormsModule, AsyncPipe, RouterLink, InfiniteScroll],
  templateUrl: './add-recipe.html',
  styleUrl: './add-recipe.scss',
})
export class AddRecipe implements OnInit {
  recipeForm!: FormGroup;
  selectedIngredient!: IRecipeIngredient | undefined;

  recipe?: IRecipeDetail;
  isEditMode = false;

  public categoryStore = inject(AdminCategoryStore);
  public recipeService: RecipeService = inject(RecipeService);
  public cuisinStore = inject(AdminCuisineStore);
  public ingredientStore = inject(IngredientStore);
  private route: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    this.categoryStore.loadAll();
    this.cuisinStore.loadAll();
    this.ingredientStore.loadAll();
  }

  ngOnInit(): void {
    this.buildForm();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;

      this.recipeService.get(id).subscribe((recipe) => {
        this.recipe = recipe;
        this.patchForm(recipe);
      });
    }
  }
  loadMore(inf: InfiniteScroll) {
    //this.ingredientService.loadNext();
    //if (!this.ingredientService.isLoading) inf.done();
  }
  buildForm() {
    this.recipeForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      categoryIds: new FormControl([], Validators.required),
      cuisineId: new FormControl('', Validators.required),
      selectedIngredientId: new FormControl(''),
      imageUrls: new FormArray([]),
      ingredients: new FormArray([]),
      steps: new FormArray([]),
    });

    if (this.isEditMode === true) {
      this.addStep();

      this.addImage();
    }
  }
  patchForm(recipe: IRecipeDetail) {
    this.recipeForm.patchValue({
      name: recipe.name,
      description: recipe.description,
      cuisineId: recipe.cuisine?.id,
      categoryIds: recipe.recipeCategories.map((c) => c.categoryId),
    });

    // images
    this.imageUrls.clear();
    recipe.recipeImages?.forEach((img) => {
      this.imageUrls.push(
        new FormControl(img.url, {
          validators: [Validators.required],
          asyncValidators: [asyncImageValidator()],
          updateOn: 'blur',
        }),
      );
    });

    // ingredients
    this.ingredients.clear();
    recipe.recipeIngredients.forEach((i) => {
      this.ingredients.push(
        new FormGroup({
          ingredientName: new FormControl(i.ingredient.name),
          ingredientUnit: new FormControl(i.ingredient.unit),
          ingredientId: new FormControl(i.ingredientId),
          quantity: new FormControl(i.quantity, Validators.required),
        }),
      );
    });

    // steps
    this.steps.clear();
    recipe.recipeSteps.forEach((s) => {
      this.steps.push(
        new FormGroup({
          stepOrder: new FormControl(s.stepOrder),
          name: new FormControl(s.name, Validators.required),
          description: new FormControl(s.description, Validators.required),
        }),
      );
    });
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }
  get steps(): FormArray {
    return this.recipeForm.get('steps') as FormArray;
  }
  get imageUrls(): FormArray {
    return this.recipeForm.get('imageUrls') as FormArray;
  }

  addIngredient() {
    const ingredientId = this.recipeForm.get('selectedIngredientId')?.value;
    const ingredient = this.ingredientStore.ingredients().find((i) => i.id === ingredientId);
    const ingredientName = ingredient?.name;
    const ingredientUnit = ingredient?.unit;

    this.ingredients.push(
      new FormGroup({
        ingredientName: new FormControl(ingredientName, [Validators.required]),
        ingredientUnit: new FormControl(ingredientUnit, [Validators.required]),
        ingredientId: new FormControl(ingredientId, [Validators.required]),
        quantity: new FormControl('', [Validators.required]),
      }),
    );
  }
  removeIngredient(i: number) {
    this.ingredients.removeAt(i);
  }
  addStep() {
    this.steps.push(
      new FormGroup({
        stepOrder: new FormControl(this.steps.length + 1),
        name: new FormControl('', [Validators.required]),
        description: new FormControl('', Validators.required),
      }),
    );
  }

  removeStep(i: number) {
    this.steps.removeAt(i);
  }

  addImage() {
    this.imageUrls.push(
      new FormControl('', {
        validators: [Validators.required],
        asyncValidators: [asyncImageValidator()],
        updateOn: 'blur',
      }),
    );
  }
  removeImage(i: number) {
    this.imageUrls.removeAt(i);
  }

  onSubmit() {
    this.recipeForm.markAllAsTouched();
    if (!this.recipeForm.valid) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { selectedIngredientId, ...recipe } = this.recipeForm.value;

    recipe.ingredients = recipe.ingredients.map((i: any) => ({
      ingredientId: i.ingredientId,
      quantity: Number(i.quantity),
    }));

    const request$ = this.isEditMode
      ? this.recipeService.update(this.recipe!.id, recipe)
      : this.recipeService.create(recipe);

    request$;
  }

  selectIngredient(ingredient: IRecipeIngredient) {
    this.selectedIngredient = ingredient;
    //console.log(this.selectIngredient + 'asd');
  }
}
