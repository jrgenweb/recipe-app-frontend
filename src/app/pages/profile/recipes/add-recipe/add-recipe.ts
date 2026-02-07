import { Component, inject, OnInit } from '@angular/core';
import {
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  FormsModule,
} from '@angular/forms';

import { AsyncPipe } from '@angular/common';

import { ActivatedRoute, RouterLink } from '@angular/router';
import { IRecipeDetail, IRecipeIngredient } from '@recipe/shared';
import { IngredientService } from '../../../../shared/services/ingredient-service';
import { CategoryService } from '../../../../shared/services/category-service';
import { CuisinService } from '../../../../shared/services/cuisine-service';
import { RecipeService } from '../../../../shared/services/recipe-service';
import { asyncImageValidator } from '../../../../shared/validators/async-image-validator';

@Component({
  selector: 'app-add',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, AsyncPipe, FormsModule, RouterLink],
  templateUrl: './add-recipe.html',
  styleUrl: './add-recipe.scss',
})
export class AddRecipe implements OnInit {
  recipeForm!: FormGroup;
  selectedIngredient!: IRecipeIngredient | undefined;

  recipe?: IRecipeDetail;
  isEditMode = false;

  public ingredientService: IngredientService = inject(IngredientService);
  public categoryService: CategoryService = inject(CategoryService);
  public recipeService: RecipeService = inject(RecipeService);
  public cuisinService: CuisinService = inject(CuisinService);
  private route: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    this.ingredientService.loadNext();
    this.categoryService.getAll();
    this.cuisinService.getAll();
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
    const ingredient = this.ingredientService.ingredients$.value.find((i) => i.id === ingredientId);
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

     
    const recipe = this.recipeForm.value;
    delete recipe.selectedIngredientId;

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
