import crypto from "crypto"

/** @returns UID length of 16 (8 hex bytes) */
export function generateUId() {
	return crypto.randomBytes(8).toString("hex")
}

export default function clickOutside(node: any, onEventFunction: any) {
    const handleClick = (event: any) => {
        var path = event.composedPath();

        if (!path.includes(node)) {
            onEventFunction();
        }
    }

    document.addEventListener("click", handleClick);

    return {
        destroy() {
            document.removeEventListener("click", handleClick);
        }
    }
}