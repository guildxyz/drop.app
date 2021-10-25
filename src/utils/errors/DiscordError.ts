class DiscordError extends Error {
  constructor(message?: string) {
    super(message ?? "Discord interaction failed.")
    this.name = "Discord Error"
  }
}

export default DiscordError
