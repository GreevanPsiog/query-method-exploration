using System.Text.Json;

public static class ProductDatabase
{
    private static readonly List<Product> _products = GenerateProducts();

    public static int GetProductCount() => _products.Count;

    public static IEnumerable<Product> SearchProducts(JsonElement query)
    {
        // Safely extract properties with null checks
        string? keyword = null;
        if (query.TryGetProperty("keyword", out var keywordProp) && keywordProp.ValueKind == JsonValueKind.String)
        {
            keyword = keywordProp.GetString()?.ToLower();
        }

        string? category = null;
        if (query.TryGetProperty("category", out var categoryProp) && categoryProp.ValueKind == JsonValueKind.String)
        {
            category = categoryProp.GetString()?.ToLower();
        }

        int? minPrice = null;
        if (query.TryGetProperty("minPrice", out var minProp) && 
            minProp.ValueKind != JsonValueKind.Null && 
            minProp.ValueKind != JsonValueKind.Undefined)
        {
            try
            {
                minPrice = minProp.GetInt32();
            }
            catch { /* Ignore if not a number */ }
        }

        int? maxPrice = null;
        if (query.TryGetProperty("maxPrice", out var maxProp) && 
            maxProp.ValueKind != JsonValueKind.Null && 
            maxProp.ValueKind != JsonValueKind.Undefined)
        {
            try
            {
                maxPrice = maxProp.GetInt32();
            }
            catch { /* Ignore if not a number */ }
        }

        IEnumerable<Product> results = _products;

        // Filter by keyword (searches in name and description)
        if (!string.IsNullOrEmpty(keyword))
        {
            results = results.Where(p => 
                p.Name.ToLower().Contains(keyword) || 
                p.Description.ToLower().Contains(keyword));
        }

        // Filter by category
        if (!string.IsNullOrEmpty(category))
        {
            results = results.Where(p => p.Category.ToLower() == category);
        }

        // Filter by price range
        if (minPrice.HasValue)
        {
            results = results.Where(p => p.Price >= minPrice.Value);
        }

        if (maxPrice.HasValue)
        {
            results = results.Where(p => p.Price <= maxPrice.Value);
        }

        return results;
    }

    private static List<Product> GenerateProducts()
    {
        var products = new List<Product>();
        var random = new Random(42); // Fixed seed for consistent demo data

        var categories = new[]
        {
            ("electronics", new[] { "Wireless Mouse", "Mechanical Keyboard", "USB-C Hub", "Monitor Stand", "Webcam HD", "Bluetooth Speaker", "External SSD", "Laptop Stand", "Wireless Charger", "Gaming Headset", "4K Monitor", "Graphics Tablet", "Noise Cancelling Headphones", "Smart Watch", "Fitness Tracker" }),
            ("furniture", new[] { "Office Chair", "Standing Desk", "Bookshelf", "Filing Cabinet", "Desk Lamp", "Monitor Arm", "Footrest", "Cable Management", "Desk Organizer", "Whiteboard" }),
            ("accessories", new[] { "Mouse Pad", "Keyboard Cover", "Screen Protector", "Laptop Sleeve", "Cable Clips", "USB Hub", "HDMI Cable", "Cleaning Kit", "Wrist Rest", "Laptop Lock" }),
            ("storage", new[] { "External Hard Drive", "USB Flash Drive", "Memory Card", "NAS Drive", "Cloud Storage", "Backup Drive", "SSD Enclosure", "Card Reader", "Drive Dock", "Storage Box" }),
            ("networking", new[] { "WiFi Router", "Ethernet Cable", "Network Switch", "WiFi Extender", "Modem", "Patch Panel", "Network Adapter", "PoE Injector", "Cable Tester", "Rack Mount" })
        };

        var adjectives = new[] { "Premium", "Professional", "Ultra", "Pro", "Elite", "Advanced", "Compact", "Portable", "Wireless", "Smart", "Ergonomic", "High-Speed", "Heavy-Duty", "Slim", "Deluxe" };
        
        var id = 1;

        // Generate 7,500 products (100 iterations * 5 categories * 15 items)
        for (int i = 0; i < 100; i++)
        {
            foreach (var (category, items) in categories)
            {
                foreach (var item in items)
                {
                    var useAdjective = random.Next(2) == 1;
                    var name = useAdjective 
                        ? $"{adjectives[random.Next(adjectives.Length)]} {item}" 
                        : item;

                    products.Add(new Product
                    {
                        Id = id++,
                        Name = name,
                        Category = category,
                        Price = Math.Round(random.Next(10, 500) + random.NextDouble(), 2),
                        Description = $"High-quality {name.ToLower()} for professional use. Features premium build quality and excellent performance.",
                        InStock = random.Next(10) > 1, // 90% in stock
                        Rating = Math.Round(random.Next(30, 50) / 10.0, 1), // 3.0 to 5.0
                        Reviews = random.Next(500),
                        Brand = $"Brand-{random.Next(1, 20)}",
                        SKU = $"SKU-{id:D6}"
                    });
                }
            }
        }

        return products;
    }
}

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Category { get; set; } = "";
    public double Price { get; set; }
    public string Description { get; set; } = "";
    public bool InStock { get; set; }
    public double Rating { get; set; }
    public int Reviews { get; set; }
    public string Brand { get; set; } = "";
    public string SKU { get; set; } = "";
}