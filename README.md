# FlashGrab
FlashGrab is your one-stop solution for flash sales. This is an autobuy app available for android built on the React Native platform with a python server as the back end. This is a completely open-source service which is open to everyone for [contributing](https://github.com/firstcontributions/first-contributions/blob/master/README.md) and improving. Know more about the app at our [official website](https://flashgrab.github.io)

## Screenshots
<a><img src="https://github.com/vishal-ds/FlashGrab/blob/master/.github/Screenshots/AddSale.jpg?raw=true" height="420" width="200" ></a>
<a><img src="https://github.com/vishal-ds/FlashGrab/blob/master/.github/Screenshots/Fingerprint.jpg?raw=true" height="420" width="200" ></a>
<a><img src="https://github.com/vishal-ds/FlashGrab/blob/master/.github/Screenshots/Light.jpg?raw=true" height="420" width="200" ></a>
<a><img src="https://github.com/vishal-ds/FlashGrab/blob/master/.github/Screenshots/applock.jpg?raw=true" height="420" width="200" ></a>

## Credits & Mentions
FlashGrab was not entirely developed from the ground up by me. Here are some other people who deserve a special mention and/or share the credit of this service's development
  * [Flipkart Autobuy](https://github.com/atultherajput/flipkart-autobuy): This repo served as the base for developing the backend for FlashGrab. Hence, the contributors deserve a special mention here. Although this specific autobuy script has support only for flipkart, it does support multiple payment methods which will be coming to FlashGrab soon. This script was already pretty good that we didn't spend much time to even make it object oriented. It performs adequately well at the moment. However, more time will be spent to make the back end more optimised and fast.
  * Logo & Themes: Our designer, [Akash Shanavas](https://www.instagram.com/akash_shanavas/), also deserves a special mention here. He has worked to create the advertisement and promotion videos as well as helped design the logo for FlashGrab, both of which have helped improve the user experience.

## Build from source
You are free to use this code and build the FlashGrab app from source only for testing and debugging purposes. Do not use this source to create and/or distribute the app without consent from the developer. However, you're always welcome to fork this repo, work on improvements and open a PR. All your contributions will be valued and you'll be given due credit for your work.

### Prerequisites
  1. python
  2. npm
  3. Android build tools (use Android Studio)
  4. [React Native environment](https://reactnative.dev/docs/environment-setup)
  5. a nice text editor
  6. knowledge in [React](https://reactjs.org) and [React Native](https://reactnative.dev/docs/getting-started)
  7. Google Chrome
### Steps for front-end
  1. Create a new React Native project: 

      ```
      npx react-native init FlashGrab
      ```
  2. Change the working directory: `cd FlashGrab`
  3. Try running the app to make sure that it's working

      ```
      npx react-native run-android
      ```
  4. Assuming you don't have any errors and the sample app shows up properly, we can proceed to initialize an empty git repository in the directory
  
      ```
      git init
      ```
  5. Add this repo as a remote origin
  
      ```
      git remote add origin https://github.com/vishal-ds/FlashGrab.git
      ```
  6. Delete the conflicting files
  
      ```
      Windows:
      del .gitattributes .gitignore App.js index.js package.json
      
      Linux:
      rm .gitattributes .gitignore App.js index.js package.json
      ```
  7. Pull the source code from this repo
  
      ```
      git pull origin master
      ```
  8. Use the installer script to install in Linux. If you're on Windows, comment line 22. Then, use the script with [WSL](https://www.microsoft.com/store/productId/9N6SVWS3RX71) in your project directory. This is not recommended however, as it's seen to break stuff rather than install it. A Windows batch file is in the works and will fix the problem soon.

      ```
      chmod +x installer.sh
      ./installer.sh
      ```
  9. Link all the assets to your project
      ```
      npx react-native link
      ```
      
  10. Try building the app once more to verify all installations are proper
  
      ```
      npx react-native run-android
      ```
  
If everything went well, you should now see the debuggable version of the exact same app that you get from the Play Store. Refer to troubleshooting section below to fix any problems.

### Steps for back end

  1. From the directory that you cloned for the front-end, copy the back end folder to a convinient location of your choice, preferably inside your front-end React Native directory itself
  
  2. Install the required python modules
  
      ```
      cd "back end"
      pip install selenium
      pip install websockets
      pip install asyncio
      ```
  3. In the connected device that you're debugging, reverse the port 5000. This is also necessary for Android emulators.
  
      ```
      adb reverse tcp:5000 tcp:5000
      ```
  5. If you are not using Windows, [get](http://chromedriver.chromium.org/downloads) the necessary chromedriver for your OS and place it in `back end/`
  4. Run the server
  
      ```
      python app.py
      ```
Now, when you start a sale in the app, it should open up Google Chrome and start the purchase by itself.

## Issues
### Issues in building

* In the event of any error(s), try cleaning gradle and resetting cache of npm 

      cd android/
      gradlew clean
      cd ..
      npm start --reset-cache
      npx react-native run-android

* The source for the node module `react-native-push-notification` will be present if you clone this repo. This is in anticipation of an issue regarding notifications not showing up. When you check the app info of the installed app, you may find that there is no **Sale Alerts** category. In such a situation, copy this whole folder and replace the exising one inside `/node_modules` with this one. Then, rebuild the app.

* Due to a bug in `react-native-material-textfield`, most likely, the metro server won't build and will throw an error
  
      TypeError: undefined is not an object (evaluating '_reactNative.Animated.Text.propTypes.style')
      
     In order to fix this, we'll be following a stackoverflow [answer](https://stackoverflow.com/questions/61226530/typeerror-undefined-is-not-an-object-evaluating-reactnative-animated-text-pr). Inside your project directory, go to the source directory of the module and open these files in your editor
     
     ```
     cd node_modules/react-native-material-textfield/src/components
     code affix/index.js helper/index.js label/index.js
     ```
     
     In all these files, find the two lines of code as follows...
     
     ```javascript
     import { Animated } from 'react-native'
     
     // in affix/index.js and helper/index.js, this is in line 14
     // in label/index.js, it's in line 46
     style: Animated.Text.propTypes.style
     ```
     
     ...and change it to:
     
     ```javascript
     import { Animated, Text } from 'react-native'
     
     style: Text.propTypes.style
     ```
     and now try reloading the app from the npm metro server window.

 * When trying to run the server, issues can mostly arise relating to the chromedriver. Check to see if your chromedriver version matches your Google Chrome's version. To check your Chrome version:
   * Start Google Chrome
   * Click the 3 dots on the top right and go to Settings
   * In the navigation bar on the left, click About Chrome
   * Your Chrome version will be displayed
   
   Now, if your Chrome version isn't 87, update your chromedriver:
   * Get the [release](http://chromedriver.chromium.org/downloads) of chromedriver corresponding to your Chrome version
   * Unzip the downloaded package
   * Replace the chromedriver in `back end/` with the new chromedriver
   * Run the server again
   
 * Please do note that this repo only contains the windows executable for demo purposes. If you're running Linux or macOS, you will have to [get the corresponding release](http://chromedriver.chromium.org/downloads) of chromedriver.
   
If issues still persist after following the instructions and trying these possibles fixes, feel free to open an issue in this repo with a detailed description of the trouble you're facing.

### Issues in development

* A weird dependency conflict in the modules `react-native-fs` and `react-native-dark-mode` make all `npm install` commands crash. I'm not able to fix this for now. Instead, use the script `manager.sh ` for installing modules.
  * In the project directory, give read permissions to the file

  ```
  chmod +x manager.sh
  ```

  * Run the file and follow the on-screen instructions to install any modules from now on.

  ```
  ./manager.sh
  ```

### Known bugs
 * The node module `react-native-dark-mode` has been deprecated. That's why it's behaving like trash and conflicting with new installs. This is the purpose of `manager.sh` even existing in this repo in the first place. The developer has replaced this with `react-native-dynamic` but this is not working with `react-native@0.63.3` as stated in [this issue](https://github.com/codemotionapps/react-native-dynamic/issues/18). Although this is marked as working and closed, it still doesn't work. And, `react-native init FlashGrab --version 0.62.0` crashes due to a dependency conflict in `eslint`. If you can fix this, I can get rid of `manager.sh` and make the development process a lot easier.
 * Although `app.py` handles Flipkart fine at the moment, their rapidly changing source code occassionally breaks it. I haven't been able to implement 100% scraping in the script to make it consistent. Any attempts to convert it to 100% scraping by using stuff like `find_element_by_xpath()` is as important as a bug fix.
 * In `app.py`, the current implementation requires `await websocket.recv()` to run 2 times leading to `websocket.send()` statements failing after the second `recv()`. In effect, no information can be sent to the user after sending the OTP to the server during a purchase with debit cards, which is critical to the overall user experience.

## Directory Structure
  ```
  |
  |-- android: Android build files
  |
  |-- back end: The back end server
  |
  |-- installer: assets for the installer script (will be deleted after it's run)
  |
  |-- src
  |    |
  |    |-- assets
  |    |     |
  |    |     |-- img: image asset files
  |    |     |-- ....all the other components
  |    |
  |    |-- screens: sources for all screens in the app
  |
  |-- index.js 
  |-- App.js
  ```

## Tips
 * When building any new UI elements and coloring them, try to use the value `global.accent` for the color always to make your element match the rest of the app. This variable is defined in `src/accents.js`.
 * For changing the accent color, refer to `src/accents.js` itself

## Support
I'm a very young developer with less knowledge and experience. It would be great if you could:
 * help me optimize the code, especially back end
 * help add new features and fix bugs that may arise
 * spread the word about the app and it's open and transparent nature
 * help reduce the natural shady doubts that people have about the app handling their sensitive data
 * [donate](https://paypal.me/vishalds) to support me
