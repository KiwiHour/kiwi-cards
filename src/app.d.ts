// See https://kit.svelte.dev/docs/types#app

import type { DatabaseDirectory } from "$lib/schema";
import type { MongoClient } from "mongodb";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			connectedMongoClient: MongoClient
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
