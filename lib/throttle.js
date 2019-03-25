export function throttle(fn, wait) {
  let time = Date.now()
  return function(...args) {
    if (time + wait - Date.now() < 0) {
      fn(...args)
      time = Date.now()
    }
  }
}
