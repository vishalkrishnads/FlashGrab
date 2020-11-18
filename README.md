# FlashGrab
FlashGrab is your one-stop solution for flash sales. This is an autobuy app available for android built on the React Native platform with a python server as the back end. This is a completely open-source service which is open to everyone for [contributing](https://github.com/firstcontributions/first-contributions/blob/master/README.md) and improving. Know more about the app at our [official website](https://flashgrab.github.io)

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
  7. Google Chrome 86
### Steps for front-end
   1. Clone this repo to your machine: 
   
      ```
      git clone https://github.com/vishal-ds/FlashGrab.git
      ```
  2. Rename the cloned folder from `FlashGrab` to something else.
  3. Create a new React Native project: 

      ```
      npx react-native init FlashGrab
      ```
  4. Change the working directory: `cd FlashGrab`
  5. Try running the app to make sure that it's working

      ```
      npx react-native run-android
      ```
  6. Assuming you don't have any errors and the sample app shows up properly, we can proceed to install some additional node modules. Copy `package.json` from the cloned folder to your new project directory.

      ```
      npm install package.json
      ```
      
  7. Try building the app once more to verify all installations are proper
  
      ```
      npx react-native run-android
      ```
  8. After the app runs, go back to the folder you renamed earlier after cloning. Copy all the files and replace the files in your project directory with them.
  
  10. Build the app again.
  
If everything went well, you should now see the debuggable version of the exact same app that you get from the Play Store

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
   
   Now, if your Chrome version isn't 86, update your chromedriver:
   * Get the [release](http://chromedriver.chromium.org/downloads) of chromedriver corresponding to your Chrome version
   * Unzip the downloaded package
   * Replace the chromedriver in `back end/` with the new chromedriver
   * Run the server again
   
 * Please do note that this repo only contains the windows executable for demo purposes. If you're running Linux or macOS, you will have to [get the corresponding release](http://chromedriver.chromium.org/downloads) of chromedriver.
   
If issues still persist after following the instructions and trying these possibles fixes, feel free to open an issue in this repo with a detailed description of the trouble you're facing.

## Directory Structure
  ```
  |
  |-- android: Android build files
  |
  |-- back end: The back end server
  |
  |-- react-native-push-notification: Working notifications dir
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
 * help me optimize the code
 * help add new features and fix bugs that may arise
 * spread the word about the app and it's open and transparent nature
 * help reduce the natural shady doubts that people have about the app handling their sensitive data
 * [donate](https://paypal.me/vishalds) to support me
