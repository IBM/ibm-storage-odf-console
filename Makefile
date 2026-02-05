REGISTRY=quay.io/shlomitn
IMAGE_TAG=1.9.0
PLATFORM=linux/amd64
TARGET_BRANCH=release-1.9.0
CONSOLE_NAME=ibm-storage-odf-plugin

CONSOLE_IMAGE=$(REGISTRY)/$(CONSOLE_NAME):$(IMAGE_TAG)

BUILD_COMMAND = docker buildx build -t $(CONSOLE_IMAGE) --platform $(PLATFORM) --build-arg TARGET_BRANCH=$(TARGET_BRANCH) -f ./Dockerfile.prod .
NON_PROD_BUILD_COMMAND = docker buildx build -t $(CONSOLE_IMAGE) --platform $(PLATFORM) -f ./Dockerfile .
PUSH_COMMAND = docker push $(CONSOLE_IMAGE)

build-image:
	$(BUILD_COMMAND)

push-image:
	$(BUILD_COMMAND) && $(PUSH_COMMAND)

non-prod-build-image:
	$(NON_PROD_BUILD_COMMAND)

non-prod-push-image:
	$(NON_PROD_BUILD_COMMAND) && $(PUSH_COMMAND)
