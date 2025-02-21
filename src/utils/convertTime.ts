export function convertTime(timer: number): string {
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  return `${minutes}m ${seconds}s`;
}
