export function onImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = 'https://placehold.co/600x400';
}
