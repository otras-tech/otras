"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NotificationGateway", {
    enumerable: true,
    get: function() {
        return NotificationGateway;
    }
});
const _websockets = require("@nestjs/websockets");
const _socketio = require("socket.io");
const _common = require("@nestjs/common");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let NotificationGateway = class NotificationGateway {
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
        const userId = client.handshake.query.userId;
        if (userId) {
            client.join(`user_${userId}`);
            this.logger.log(`Client ${client.id} joined room user_${userId}`);
        }
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    sendToUser(userId, event, data) {
        this.server.to(`user_${userId}`).emit(event, data);
    }
    handlePing(client) {
        client.emit('pong', {
            message: 'Websocket is alive'
        });
    }
    constructor(){
        this.logger = new _common.Logger('NotificationGateway');
    }
};
_ts_decorate([
    (0, _websockets.WebSocketServer)(),
    _ts_metadata("design:type", typeof _socketio.Server === "undefined" ? Object : _socketio.Server)
], NotificationGateway.prototype, "server", void 0);
_ts_decorate([
    (0, _websockets.SubscribeMessage)('ping'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _socketio.Socket === "undefined" ? Object : _socketio.Socket
    ]),
    _ts_metadata("design:returntype", void 0)
], NotificationGateway.prototype, "handlePing", null);
NotificationGateway = _ts_decorate([
    (0, _websockets.WebSocketGateway)({
        cors: {
            origin: '*'
        }
    })
], NotificationGateway);

//# sourceMappingURL=notification.gateway.js.map