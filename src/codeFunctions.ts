import crypto from "crypto";

export function base64URLEncode(buffer: Buffer): string {
    return buffer.toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
}

export function sha256(str: string): Buffer {
    return crypto.createHash("sha256").update(str).digest();
}