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
  parseWsMessage(data: any): void
  parseBusinessMessage(dataView: DataView, body: any): void
  handlerCommand(command: any): void
  danmuMsgCallback(command: any): void
  parseTextEmoticons(info: any): any[]
  sendGiftCallback(command: any): void
  guardBuyCallback(command: any): void
  superChatMessageCallback(command: any): void
  superChatMessageDeleteCallback(command: any): void
}
