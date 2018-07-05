export function pause(wait: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, wait));
}

export function promise(operation: () => void): Promise<void> {
  return new Promise((resolve) => {
    operation();
    resolve();
  });
}
