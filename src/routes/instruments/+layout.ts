import { parseURL } from "kit-query-params";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = ({ url }) => {
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