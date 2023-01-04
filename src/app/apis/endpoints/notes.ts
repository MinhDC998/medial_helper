import { combineEndpoint } from "@utils/helper";

const notePrefix = "notes";

export const notesEndpoint = {
  listNotes: combineEndpoint(notePrefix, "all"),
};
