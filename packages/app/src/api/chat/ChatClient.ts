export interface ChatClient {
  start(): void
  stop(): void
}

export interface WSChatClient {
  wsConnect(): void
  onWsOpen(): void
  onWsClose(): void
  onWsMessage(event: any): void
}

export interface ChatClient1 extends ChatClient, WSChatClient {
  wsConnect(): void
  onWsOpen(): void
  refreshReceiveTimeoutTimer(): void
  onReceiveTimeout(): void
  onWsClose(): void
  onWsMessage(event: MessageEvent<any>): void
}

export interface ChatClient2 extends ChatClient {
  refreshTimer(): void
  onTimeout(): void
}

export interface ChatClient3 extends ChatClient {
  initRoom(): void
  makePacket(data: any, operation: any): Blob
  sendAuth(): void
  wsConnect(): void
  onWsOpen(): void
  sendHeartbeat(): void
  refreshReceiveTimeoutTimer(): void
  onReceiveTimeout(): void
  discardWebsocket(): void
  onWsClose(): void
  onWsMessage(event: MessageEvent): void
  parseWsMessage(data): void
  parseBusinessMessage(dataView, body): void
  handlerCommand(command): void
  danmuMsgCallback(command): void
  parseTextEmoticons(info: any): any[]
  sendGiftCallback(command): void
  guardBuyCallback(command): void
  superChatMessageCallback(command): void
  superChatMessageDeleteCallback(command): void
}
