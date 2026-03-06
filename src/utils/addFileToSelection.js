export function addFileToSelection(file, setSelectedFiles) {
  setSelectedFiles((prev) => {
    const newSet = new Set(prev);

    const exists = [...newSet].some((f) => f.publicId === file.publicId);

    if (!exists) newSet.add(file);

    return newSet;
  });
}