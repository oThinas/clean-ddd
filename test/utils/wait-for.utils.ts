// biome-ignore lint/nursery/useExplicitType: The type is already explicit by the value
export async function waitFor(assertions: () => void, maxDuration = 1000): Promise<void> {
  return new Promise((resolve, reject) => {
    let elapsedTime = 0;

    const interval = setInterval(() => {
      elapsedTime += 10;

      try {
        assertions();
        clearInterval(interval);
        resolve();
      } catch (error) {
        if (elapsedTime >= maxDuration) {
          reject(error);
        }
      }
    }, 10);
  });
}
