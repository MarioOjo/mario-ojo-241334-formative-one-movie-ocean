
# MOVIE OCEAN REACT APP 

A brief description of what this project does and who it's for

An app that uses a tmbd API to enable the user to search and view finacial metrics of any movie withing a bar and aradar chart representation . As well as compare tthosese metric to each other.


## API Reference

#### Get all items

```http
  GET https://api.themoviedb.org/3/search/movie

```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |
| `query` | `string` | Required. Movie title to search |
| `page` | `number` | Optional. Page number for results|

#### GET https://api.themoviedb.org/3/search/movie?api_key=bf12ff0542145f969307e128eae46673Y&query=Inception


```http
  GET /api/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key`      | `string` | Required. Your TMDB API key |
| `id` | `number` | Required. Movie ID to fetch details |


#### GET https://api.themoviedb.org/3/movie/27205?api_key=YOUR_API_KEY




