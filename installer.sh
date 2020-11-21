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
    npm install package.json
    printf "\nDone.\n"
    # uncomment this line and comment line 22 if you're using this script on Windows with WSL
    # npm install @react-native-community/clipboard @react-native-community/datetimepicker @react-native-community/masked-view @react-native-community/netinfo @react-navigation/bottom-tabs@5.9.1 @react-navigation/native@5.7.5 @react-navigation/stack@5.9.2 dom-parser moment react-native-android-open-settings react-native-elements react-native-fingerprint-scanner react-native-gesture-handler react-native-keep-awake react-native-material-textfield react-native-modal-datetime-picker react-native-progress react-native-push-notification react-native-reanimated react-native-safe-area-context react-native-screens react-native-share-menu react-native-sqlite-storage react-native-swipeout
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