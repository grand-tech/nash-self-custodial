export function fetchCount(currentCount = 0, amount = 1) {
  return new Promise<number>((resolve) =>
    setTimeout(() => resolve(currentCount + amount), 1000),
  );
}
