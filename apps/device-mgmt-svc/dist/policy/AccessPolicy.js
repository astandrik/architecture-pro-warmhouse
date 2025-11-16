"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessPolicy = void 0;
class AccessPolicy {
    // Stub allow-all policy for MVP
    async canControl(_userId, _deviceId) {
        return true;
    }
}
exports.AccessPolicy = AccessPolicy;
