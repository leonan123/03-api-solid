export class MaxDistanceExceededError extends Error {
  constructor() {
    super('Max distance exceeded.')
    this.name = 'MaxDistanceExceededError'
  }
}
