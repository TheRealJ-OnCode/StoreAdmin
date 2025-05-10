export default class OrderModel {
    static async searchOrders(query) {
        const response = await fetch(`/search-orders?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error("Failed to fetch orders");
        }
        return response.json();
    }
}
