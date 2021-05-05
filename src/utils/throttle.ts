/* eslint-disable @typescript-eslint/no-explicit-any */

export function throttle<T extends (...args: any[]) => any> (
  callbacl: T, 
  limit: number = 100
): (...args: Parameters<T>) => ReturnType<T> | void  {
  let buzzy = false
  return (...args: Parameters<T>): ReturnType<T> | void => {
    if(!buzzy) {
      buzzy = true
      setTimeout(() => { buzzy = false }, limit)
      return callbacl(...args)
    }
  }
}
