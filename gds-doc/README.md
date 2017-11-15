
# Google Drive Server Documentation

Our dataset, based on [one from Nasa's Open Data Portal](https://data.nasa.gov/Space-Science/Meteorite-Landings/gh4g-9sfh), is hosted on Google Drive and served using [Google Apps Script](https://developers.google.com/apps-script/). We've cleaned up the data removing entries with empty/invalid fields.

The server can be accessed via the following URL:

```
https://script.google.com/macros/s/AKfycbwgjNyIvsT0NCp-TviTk5Tvc9i279eKE9hBWPxshoZwLCkJfd82/exec
```

## API

To keep the endpoints short in the following description, `[URL]` will be used instead of the actual server's URL listed above.

### All the data

To get the whole data, simply use the server's URL without a query string:

```
[URL]
```

### Data for a given year

To get the data for a given year, add a `year` parameter to the query string:

```
[URL]?year=1978
```

### Data for a given year interval

To get all the data between two given years, add `from` and `until` parameters to the query string:

```
[URL]?from=1926&until=2002
```

Note that entries where year is one of `from` and `until` are included in the returned dataset.

### Data for a given country

To get the data specific to a given country, add a `country` parameter to the query string:

```
[URL]?country=ch
```
