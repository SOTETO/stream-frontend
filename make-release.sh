set - ex

USERNAME=vivaconagua

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[", ]//g')

IMAGE=$(cat package.json \
  | grep name \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[", ]//g')


echo "$IMAGE v$PACKAGE_VERSION"

docker build -t $USERNAME/$IMAGE:latest .

docker tag $USERNAME/$IMAGE:latest $USERNAME/$IMAGE:$PACKAGE_VERSION
