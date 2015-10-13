#!/bin/bash
#######################################################################
# All information contained herein is, and remains
# the property of Cortex Media and its suppliers,
# if any.  The intellectual and technical concepts contained
# herein are proprietary to Cortex Media and its suppliers
# and may be covered by Canada and Foreign Patents,
# and are protected by trade secret or copyright law.
# Dissemination of this information or reproduction of this material
# is strictly forbidden unless prior written permission is obtained
# from Cortex Media.
#
# copyright    Cortex Media 2015
#
# author    Mathieu Cote
#######################################################################
set -e

setup_runtime_parameters() {
    if [ -z "$1"] || [ -z "$2" ]
    then
        echo "You need to specify a Class Path and a Class Name"
        exit 1
    else
        classPath="$2"
        className="$1"
    fi
}

create_repositories() {
    mkdir -p src/$2
    chmod -f -R 777 src/$2
    mkdir -p assets/$fileName/img
    chmod -f -R 777 asset/$fileName
}

create_assets() {
    touch assets/$fileName/$fileName.html
    touch assets/$fileName/$fileName.scss
    touch assets/$fileName/$fileName.json
}

create_typescript_view() {
    fileContent=$(<view.template)

    fileContent="${fileContent//__class__/$1}"
    fileContent="${fileContent//__author__/$3}"
    fileContent="${fileContent//__file__/$fileName}"

    echo "$fileContent" >> src/$2/$1View.ts
}

create_typescript_model() {
    fileContent=$(<model.template)

    fileContent="${fileContent//__class__/$1}"
    fileContent="${fileContent//__author__/$3}"
    fileContent="${fileContent//__file__/$fileName}"

    echo "$fileContent" >> src/$2/$1Model.ts
}

create_typescript_controller() {
    fileContent=$(<controller.template)

    fileContent="${fileContent//__class__/$1}"
    fileContent="${fileContent//__author__/$3}"
    fileContent="${fileContent//__file__/$fileName}"

    echo "$fileContent" >> src/$2/$1Controller.ts
}

create_typescript_files() {
    create_typescript_view
    create_typescript_model
    create_typescript_controller
}


characterToReplace="/"

packageName="${classPath//$characterToReplace/.}"
fileName=$(echo "$className" | tr '[:upper:]' '[:lower:]')

create_repositories
create_assets
create_typescript_files
