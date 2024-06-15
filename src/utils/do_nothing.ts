export async function sleep(miliseconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, miliseconds));
}

export function doNothing(..._: any[]) {}
