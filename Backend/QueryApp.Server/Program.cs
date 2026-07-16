using System.Text.Json;
using Microsoft.AspNetCore.Http.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Enable CORS middleware
app.UseCors();

// QUERY endpoint - searches the database
app.MapMethods("/api/search", new[] { "QUERY" }, async (HttpRequest req) =>
{
    using var reader = new StreamReader(req.Body);
    var bodyString = await reader.ReadToEndAsync();
    
    JsonElement query;
    try
    {
        query = JsonSerializer.Deserialize<JsonElement>(bodyString);
    }
    catch (JsonException)
    {
        return Results.BadRequest(new { error = "Invalid JSON body" });
    }

    var resultsList = ProductDatabase.SearchProducts(query).ToList();

    var response = new
    {
        method = "QUERY",
        query,
        results = resultsList.Take(20).Select(p => new
        {
            p.Id,
            p.Name,
            p.Price,
            p.Category,
            p.InStock,
            p.Rating,
            p.Reviews,
            p.Brand
        }),
        total = resultsList.Count,
        bodyLength = bodyString.Length,
        message = resultsList.Count > 20 ? $"Showing first 20 of {resultsList.Count} results" : null
    };

    return Results.Ok(response);
});

// GET endpoint - searches the database
app.MapGet("/api/search", (HttpRequest req) =>
{
    var keyword = req.Query["keyword"].ToString();
    var category = req.Query["category"].ToString();
    
    int? minPrice = null;
    if (req.Query["minPrice"].Count > 0 && int.TryParse(req.Query["minPrice"], out var min))
    {
        minPrice = min;
    }
    
    int? maxPrice = null;
    if (req.Query["maxPrice"].Count > 0 && int.TryParse(req.Query["maxPrice"], out var max))
    {
        maxPrice = max;
    }

    var queryObj = new
    {
        keyword = string.IsNullOrEmpty(keyword) ? null : keyword,
        category = string.IsNullOrEmpty(category) ? null : category,
        minPrice,
        maxPrice
    };

    var jsonQuery = JsonSerializer.SerializeToElement(queryObj);
    var results = ProductDatabase.SearchProducts(jsonQuery).ToList();

    var queryString = req.QueryString.Value ?? "";

    var response = new
    {
        method = "GET",
        query = new
        {
            queryObj.keyword,
            queryObj.category,
            queryObj.minPrice,
            queryObj.maxPrice,
            urlLength = queryString.Length
        },
        results = results.Take(20).Select(p => new
        {
            p.Id,
            p.Name,
            p.Price,
            p.Category,
            p.InStock,
            p.Rating,
            p.Reviews,
            p.Brand
        }),
        total = results.Count,
        warning = queryString.Length > 2000 ? "⚠️ URL exceeds IE/Edge limits!" : null
    };

    return Results.Ok(response);
});

// Health check endpoint
app.MapGet("/", () => Results.Text($"HTTP QUERY Method Demo API is running!\nTotal products in database: {ProductDatabase.GetProductCount()}"));

app.Run();