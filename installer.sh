#!/bin/bash

clear
printf "\n \t \t \t FlashGrab installer\n"
printf "\t \t \tThis is a one-time use script.\n\n"
printf "\nEnsure you have a nice internet connection and a cup of coffee before proceeding\n"
printf "\nAnything other than small letter y will be treated as NO\n"
read -p "Are you sure want to proceed? (y/n) >>> " confirm

if [ $confirm == "y" ]
then
    printf "\nMoving icon and theme assets to android folder."
    rm -r android/app/src/main/res
    mv installer/res android/app/src/main
    printf "\nDone.\n"
    printf "\nMoving other android build files"
    mv installer/AndroidManifest.xml android/app/src/main
    mv installer/app/build.gradle android/app/
    mv installer/build.gradle android/
    printf "\nDone.\n"
    printf "\nInstalling node modules. Please wait."
    # comment line 22 if you're using this script on Windows with WSL
    # and run npm install package.json from cmd
    npm install package.json
    printf "\nDone.\n"
    printf "\nDownloading the problematic modules from GitHub. This might take a while...\n"
    git clone https://github.com/Flashgrab/modules.git
    printf "Done.\n"
    printf "\nMoving the modules to node_modules. This might take a while too.."
    mv modules/react-native-dark-mode node_modules/
    printf "\n(1/2) complete. Please wait."
    mv modules/react-native-fs/ node_modules/
    printf "\n(2/2) complete. Done.\n"
    printf "\nUpdating package.json"
    sed -i '25i\    "react-native-dark-mode": "^0.2.2",' package.json
    sed -i '25i\    "react-native-fs": "^2.16.6",' package.json
    npx react-native link react-native-vector-icons
    printf "\nDone.\n"
    printf "\nCleaning Up"
    rm -r installer
    rm -r modules
    printf "\nDone.\n"
    printf "\nRun react-native link and build the app."
    printf "\nIf you have any problems, feel free to open an issue: https://github.com/vishal-ds/FlashGrab/issues/new"
else
    printf "\nQuitting script\n"
fi