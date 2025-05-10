const uniqueIds = new Set();

export function generateUniqueId() {
    let uniqueId;
    do {
        const timestamp = Date.now();
        const randomNum = Math.random().toString(36).substr(2, 9);
        uniqueId = `${timestamp}-${randomNum}`;
    } while (uniqueIds.has(uniqueId)); // Check if the ID is already in the list

    uniqueIds.add(uniqueId); // Add the unique ID to the list
    return uniqueId;
}