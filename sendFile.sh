PRESIGN_URL="https://5nuxl0i2w4.execute-api.eu-central-1.amazonaws.com"
SYSTEM=SYS
ENVIRONMENT=DEVT
OBJECTID=transaction-1001
VERSION=1.1
SERVICEID=FTP_S3_DATA_UPLOAD
PREFIX=x-amz-meta

if [ "$1" = "" ]
then
  echo "Usage: $0 filename"
  exit
fi

FILENAME=$1
BASE_FILENAME=`basename $FILENAME`
CONTENT_TYPE=`file -b --mime-type $1`

# get presign url
UPLOAD_URL=`curl -H "system: ${SYSTEM}" -H "environment: ${ENVIRONMENT}" \
    -H "objectid: ${OBJECTID}" -H "version: ${VERSION}" \
    -H "serviceid: ${SERVICEID}" -H "filename: ${BASE_FILENAME}" \
    -H "contenttype: ${CONTENT_TYPE}" -s $PRESIGN_URL | jq --raw-output '.url'`

# now upload the file
curl -H "${PREFIX}-system: ${SYSTEM}" -H "${PREFIX}-environment: ${ENVIRONMENT}" \
    -H "${PREFIX}-objectid: ${OBJECTID}" -H "${PREFIX}-version: ${VERSION}" \
    -H "${PREFIX}-serviceid: ${SERVICEID}" -H "${PREFIX}-filename: ${BASE_FILENAME}" \
    -H "Content-Type: ${CONTENT_TYPE}" \
    --upload-file ${FILENAME} -s $UPLOAD_URL
 

