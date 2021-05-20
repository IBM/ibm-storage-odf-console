# ibm-storage-odf-console
ibm-storage-odf-console provides IBM storage specific console page, which will be loaded by ODF console when end users access IBM storage. It's specially designed for displaying IBM specific storage attributes to customer. Current scope includes IBM flashsystem only.

## Notice
As the dynamic plugin sdk is under development, this console page needs build with console-app as static plugin.

## Usage

1. `git clone https://github.com/openshift/console.git` to get OpenShift console app.
2. `cd console` and add this git repo as a plugin in frontend/packages.json.
    `vi frontend/packages/console-app/package.json`
    add below config in dependencies
    ```
    "@console/ibm-storage-odf-plugin": "git+https://<username>:<password>@github.com/IBM/ibm-storage-odf-console.git",
    ```
3. `./build.sh` to build the console code
4. `./examples/run-bridge.sh` to run the bridge

