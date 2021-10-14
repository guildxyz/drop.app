class TransactionError extends Error {
  constructor(message?: string) {
    super(message ?? "Transaction failed.")
    this.name = "Transaction Error"
  }
}

export default TransactionError
