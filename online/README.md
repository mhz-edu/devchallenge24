# Wasn't submitted
# Solution attempt to devchallenge `24 online round backend task

Audio record analysis service
===

The service receives requests with links to audio files and returns transcribed text along with information about the emotional tone and a list of categories to which the audio could be attributed.  

Built with:
- Nest.js
- [whisper.cpp](https://github.com/ggerganov/whisper.cpp)
- [Natural.js](https://naturalnode.github.io/natural/)
- PostgreSQL
- Redis

Solution consist of 5 services:
- api - user facing service, that provides category management capabilities, sending audio and getting results
- processing - provides queue, job handlers
- whisper - performs audio transcribe
- redis - queue data storage
- postgres - api data storage

## API descirption

```GET /category```

Returns list of categories

```POST /category```

Creates new category with the list of keywords

> Body format
> ```
>   { "title": <category title>,
>     "points": ["keyword1", "keyword2" ...]
>   }
> ```


```GET /call/:id```

Gets information about created call

1. If call is not processed yet - response code 202
2. If call is processed then call data is returned


```POST /call```

Creates new call for processing

> Body format
> ```
>   { "audio_url": <link to audio wav file>  }
> ```


> Example: 
>
> `{ "audio_url": "https://github.com/ggerganov/whisper.cpp/raw/refs/heads/master/samples/jfk.wav" }`
>



### Limitations

1. Only links to wav files are supported at the moment
2. Only initially provided categories are taken into account. Categories, created after the start are not cosidered.
3. Minimal to no validations 

## Development

## Run in docker

It is possible to run service in docker by executing the following command

`docker-compose up`

`api` service will be exposed on port 3000

## Run tests in docker

To run tests in docker execute the following command

`docker-compose -f .\docker-compose.test.yaml up`

