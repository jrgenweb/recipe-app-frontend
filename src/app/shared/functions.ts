export function onImageError(event: Event, imgPath?: string) {
  const img = event.target as HTMLImageElement;
  img.src = imgPath || '/no-recipe.avif';
}
