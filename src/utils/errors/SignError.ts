class SignError extends Error {
  constructor(message?: string) {
    super(message ?? "Failed to sign data.")
    this.name = "Sign Error"
  }
}

export default SignError
