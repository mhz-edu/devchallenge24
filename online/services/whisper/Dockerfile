FROM ghcr.io/ggerganov/whisper.cpp:main
WORKDIR /app
RUN sh ./models/download-ggml-model.sh tiny.en
EXPOSE 3000
CMD [ "/app/server -nt --host 0.0.0.0 --port 5000 -m /app/models/ggml-tiny.en.bin" ]