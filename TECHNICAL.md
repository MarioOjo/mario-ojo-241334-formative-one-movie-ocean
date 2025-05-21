# Technical Description: Movie Ocean

## Overview
Movie Ocean is a React-based data visualization tool that analyzes and compares movie metrics using data from The Movie Database (TMDb) API. The app transforms raw API data into interactive financial and performance charts.

## Core Features
- **Single-Movie Analysis**: 
  - Bar charts (budget/revenue/profit)
  - Radar charts (rating/popularity/runtime)
- **Dual-Movie Comparison**:
  - Side-by-side financial metrics
  - Performance attribute benchmarking
- **Responsive Design**: Works on mobile/desktop

## APIs Used
| API | Purpose | Data Retrieved |
|------|---------|----------------|
| TMDb | Primary | Movie details, ratings, metadata |
| BoxOffice (Custom) | Supplemental | Revenue, weeks in theaters |

## Visualization Types
1. **Bar Charts**: 
   - Financial comparisons (USD millions)
   - Uses Chart.js with gradient fills
2. **Radar Charts**: 
   - Normalized performance metrics 
   - Dynamic axis scaling
3. **Comparison View**:
   - Dual-column layout with VS indicator
   - Tabbed chart switching

## Key Technical Stack
```mermaid
flowchart TD
    A[React] --> B[Chart.js]
    A --> C[Axios]
    C --> D[TMDb API]
    C --> E[BoxOffice API]