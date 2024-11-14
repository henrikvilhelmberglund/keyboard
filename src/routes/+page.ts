import { parseURL } from "kit-query-params";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ url }) => {
	const queryParams = parseURL(url, {
		instrument: "string",
		size: "string",
		octave: "string",
	});
	return {
		instrument: queryParams.instrument,
    size: queryParams.size,
		octave: queryParams.octave,
	};
}