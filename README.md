# ibm-storage-odf-console
ibm-storage-odf-console provides IBM storage specific console page, which will be loaded by ODF console when end users access IBM storage. It's specially designed for displaying IBM specific storage attributes to customer. Current scope includes IBM flashsystem only.

## Notice
As the dynamic plugin sdk is under development, this console page needs build with console-app as static plugin.

## Usage

1. `git clone https://github.com/openshift/console.git` to get OpenShift console app.
2. `cd console;git clone https://github.com/IBM/ibm-storage-odf-console.git frontend/packages/ibm-storage-odf-console` to clone this repo to packages folder.
3. add this git repo as a plugin in frontend/packages.json.
    `vi frontend/packages/console-app/package.json`
    add below config in dependencies
    ```
    "@console/ibm-storage-odf-plugin": "0.0.0-fixed",
    ```
4. `./build.sh` to build the console code
5. `./examples/run-bridge.sh` to run the bridge
6. build docker image
  `docker build --network=host -t <repo-address>/<image-name>:<image-version> .`