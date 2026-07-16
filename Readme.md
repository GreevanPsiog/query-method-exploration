# HTTP QUERY Method Exploration

A comprehensive demo application showcasing the experimental IETF HTTP QUERY method. This project demonstrates how the QUERY method solves the limitations of using GET (URL length limits) and POST (lack of cacheability/idempotency) for complex, read-only API requests.

## Overview

The HTTP QUERY method is an emerging IETF Internet-Draft designed to allow safe, idempotent requests to include a request body. This is particularly useful for modern APIs (like complex search filters, analytics, or GraphQL-like operations) that require sending structured JSON data without abusing the POST method or hitting URL character limits.

## Features

- **Live Demo**: Interactive search interface querying a mock database of 7,500+ products.
- **Method Comparison**: Side-by-side visualization of how GET and QUERY handle the exact same search parameters.
- **Stress Testing**: Automated tests pushing both methods to their breaking points, demonstrating GET's failure at ~10K characters (HTTP 414/431) while QUERY handles 500KB+ payloads effortlessly.
- **Realistic Backend**: In-memory database with dynamic filtering by keyword, category, and price range.

## Tech Stack

- **Backend**: .NET 10 (Minimal APIs, C#)
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Inline CSS (Zero-dependency, clean UI)

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Node.js](https://nodejs.org/) (v18 or higher) and npm

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/query-method-exploration.git
cd query-method-exploration