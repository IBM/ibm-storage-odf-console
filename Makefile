IMAGE_REPO="docker.io"
NAME_SPACE="ibmcom"
CONSOLE_IMAGE_VERSION=1.3.0

CONSOLE_NAME=ibm-storage-odf-plugin

CONSOLE_IMAGE=$(IMAGE_REPO)/${NAME_SPACE}/$(CONSOLE_NAME)



prod-build-image:
	docker build -t $(CONSOLE_IMAGE):$(CONSOLE_IMAGE_VERSION) -f ./Dockerfile.prod .

prod-push-image: prod-build-image
	docker push $(CONSOLE_IMAGE):$(CONSOLE_IMAGE_VERSION)

build-image:
	docker build -t $(CONSOLE_IMAGE):$(CONSOLE_IMAGE_VERSION) -f ./Dockerfile .

push-image: build-image
	docker push $(CONSOLE_IMAGE):$(CONSOLE_IMAGE_VERSION)