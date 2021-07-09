# ibm-storage-odf-console
ibm-storage-odf-console provides IBM storage specific console page, which will be loaded by ODF console when end users access IBM storage. It's specially designed for displaying IBM specific storage attributes to customer. Current scope includes IBM flashsystem only.

## Dependency
Refer the Readme in below repo to install the necessary packages. IBM storage plugin works with OCP console dynamic plugin and ODF console. It is enabled after ibm-storage-odf-operator installed successfully. 
```
https://github.com/bipuladh/odf-console
https://github.com/openshift/console
https://github.com/IBM/ibm-storage-odf-operator
```
## Local development

1. `git clone https://github.com/IBM/ibm-storage-odf-console.git` to clone this repo.
2. `yarn install;yarn build` to build plugin page.
3. `yarn http-server` to serve http. This plugin uses port `9003` by default.


## Deployment in a cluster
IBM storage plugins are supposed to be deployed via [OLM operators](https://github.com/operator-framework).
In case of testing this plugin, we just apply a minimal OpenShift manifest which adds the necessary resources.

```sh
oc apply -f oc-manifest.yaml
```

Note that the `Service` exposing the HTTP server is annotated to have a signed
[service serving certificate](https://docs.openshift.com/container-platform/4.6/security/certificates/service-serving-certificate.html)
generated and mounted into the image. This allows us to run the server with HTTP/TLS enabled, using
a trusted CA certificate.

## Enabling the plugin

Once deployed on the cluster, this plugin must be enabled before it can be loaded by Console.

To enable the plugin manually, edit [Console operator](https://github.com/openshift/console-operator)
config and make sure the plugin's name is listed in the `spec.plugins` sequence (add one if missing):

```sh
oc edit console.operator.openshift.io cluster
```

```yaml
# ...
spec:
  plugins:
    - ibm-storage-odf-plugin
# ...
```

## Docker image

Following commands should be executed in Console repository root.
1. Build the image
```
docker build -f Dockerfile -t quay.io/shdn/ibm-storage-odf-plugin:latest .
```