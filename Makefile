REGISTRY="docker.io"
NAMESPACE="ibmcom"
CONSOLE_IMAGE_VERSION=1.3.0

CONSOLE_NAME=ibm-storage-odf-plugin

CONSOLE_IMAGE=$(REGISTRY)/${NAMESPACE}/$(CONSOLE_NAME):$(CONSOLE_IMAGE_VERSION)


prod-build-image:
	docker build -t $(CONSOLE_IMAGE)-f ./Dockerfile.prod .

prod-push-image: prod-build-image
	docker push $(CONSOLE_IMAGE)

build-image:
	docker build -t $(CONSOLE_IMAGE) -f ./Dockerfile .

push-image: build-image
	docker push $(CONSOLE_IMAGE)