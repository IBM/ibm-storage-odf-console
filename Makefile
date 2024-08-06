REGISTRY=quay.io/ibmodffs
IMAGE_TAG=1.6.0
PLATFORM=linux/amd64,linux/ppc64le,linux/s390x
TARGET_BRANCH=release-1.6.0
CONSOLE_NAME=ibm-storage-odf-plugin

CONSOLE_IMAGE=$(REGISTRY)/$(CONSOLE_NAME):$(IMAGE_TAG)

BUILD_COMMAND = docker buildx build -t $(CONSOLE_IMAGE) --platform $(PLATFORM) --build-arg TARGET_BRANCH=$(TARGET_BRANCH) -f ./Dockerfile.prod .
NON_PROD_BUILD_COMMAND = docker buildx build -t $(CONSOLE_IMAGE) --platform $(PLATFORM) -f ./Dockerfile .

build-image:
	$(BUILD_COMMAND)

push-image:
	$(BUILD_COMMAND) --push

non-prod-build-image:
	$(NON_PROD_BUILD_COMMAND)

non-prod-push-image:
	$(NON_PROD_BUILD_COMMAND) --push
