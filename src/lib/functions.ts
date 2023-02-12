import crypto from "crypto"

/** @returns UID length of 16 (8 hex bytes) */
export function generateUId() {
	return crypto.randomBytes(8).toString("hex")
}