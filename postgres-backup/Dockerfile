FROM google/cloud-sdk:alpine

RUN apk add --no-cache postgresql-client bash

WORKDIR /usr/src/app
COPY backup.sh .

CMD ["./backup.sh"]