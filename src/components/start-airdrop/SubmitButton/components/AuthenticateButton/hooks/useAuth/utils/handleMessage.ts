const handleMessage =
  (resolve: (value?: any) => void, reject: (value: any) => void) =>
  (event: MessageEvent): void => {
    // Conditions are for security and to make sure, the expected messages are being handled
    // (extensions are also communicating with message events)
    if (
      event.isTrusted &&
      event.origin === window.location.origin &&
      typeof event.data === "object" &&
      "type" in event.data &&
      "data" in event.data
    ) {
      const { data, type } = event.data

      switch (type) {
        case "DC_AUTH_SUCCESS":
          resolve(data)
          break
        case "DC_AUTH_ERROR":
          reject(data.description)
          break
        default:
          // Should never happen, since we are only processing events that are originating from us
          reject("Recieved an invalid message from authentication window")
      }
    }
  }

export default handleMessage
