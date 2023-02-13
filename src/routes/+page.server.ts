import type { DatabaseDirectory } from '$lib/schema';
import type { PageServerLoad } from './$types';

interface Props {
	rootDirectory: DatabaseDirectory.Node<"root">
}

export const load: PageServerLoad = async ({ locals }) => {

    return { rootDirectory: locals.rootDirectory } as Props;

}