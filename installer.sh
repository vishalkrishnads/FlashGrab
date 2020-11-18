clear
printf "\t\t\tFlashGrab module installer\n\n"
read -p "What do you want to install? >>> " module
# printf "\nAnything other than the small letter 'y' is NO\n"
# read -p "Do you want to save it?(y) >>> " save

echo "Deleting problematic modules"
cd node_modules/
rm -r react-native-dark-mode
rm -r react-native-fs
echo "Done."
cd ..

echo "Removing them from package.json for now"
sed -i.bak -e '25,26d' package.json
rm package.json.bak

printf "Installing your module\n"
npm install --save $module
# if [ $save == "y" ]
# then
#     npm install --save $module
# else
#     npm install $module
# fi

echo "Adding back modules to package.json"
sed -i '25i\    "react-native-dark-mode": "^0.2.2",' package.json
sed -i '25i\    "react-native-fs": "^2.16.6",' package.json
echo "Done."

echo "Copying the modules back to node_modules/. This might take a while."
cp -R modules_backup/react-native-dark-mode node_modules/
echo "(1/2) complete. Please wait."
cp -R modules_backup/react-native-fs node_modules/
echo "(2/2) complete. Done."

echo "Finished. Your new module is now ready for use"