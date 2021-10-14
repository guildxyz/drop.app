class BackendError extends Error {
  constructor(message?: string) {
    super(message ?? "Unable to reach backend.")
    this.name = "Backend Error"
  }
}

export default BackendError
