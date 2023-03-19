# FlashGrab

> :warning: This was my first open-source project and has since been shut down.
> 
> :no_entry: Development was halted and repository has been archived

FlashGrab is your one-stop solution for flash sales. This is an autobuy app available for android built on the React Native platform with a python server as the back end. This is a completely open-source service which is open to everyone for [contributing](https://github.com/firstcontributions/first-contributions/blob/master/README.md) and improving. Know more about the app at our [official website](https://flashgrab.github.io)

## Screenshots
<a><img src="https://github.com/vishal-ds/FlashGrab/blob/beta/.github/Screenshots/AddSale.png?raw=true" height="420" width="300" ></a>
<a><img src="https://github.com/vishal-ds/FlashGrab/blob/beta/.github/Screenshots/Details.png?raw=true" height="420" width="200" ></a>
<a><img src="https://github.com/vishal-ds/FlashGrab/blob/beta/.github/Screenshots/Instruction.png?raw=true" height="420" width="200" ></a>
<a><img src="https://github.com/vishal-ds/FlashGrab/blob/beta/.github/Screenshots/Settings.png?raw=true" height="420" width="200" ></a>

## To-Do
* Build a node server from scratch
* Implement animations in Instructions and Schedule Sale pages.
* Switch to FastLane if possible
* Complete live updation for instructions

## Credits & Mentions
FlashGrab was not entirely developed from the ground up by me. Here are some other people who deserve a special mention and/or share the credit of this service's development
  * [Flipkart Autobuy](https://github.com/atultherajput/flipkart-autobuy): This repo served as the base for developing the backend for FlashGrab. Hence, the contributors deserve a special mention here. Although this specific autobuy script has support only for flipkart, it does support multiple payment methods which will be coming to FlashGrab soon. This script was already pretty good that we didn't spend much time to even make it object oriented. It performs adequately well at the moment. However, more time will be spent to make the back end more optimised and fast.
  * Logo & Themes: Our designer, [Akash Shanavas](https://www.instagram.com/akash_shanavas/), also deserves a special mention here. He has worked to create the advertisement and promotion videos as well as helped design the logo for FlashGrab, both of which have helped improve the user experience.

## Build from source
Please refer to branch [master](https://github.com/vishalkrishnads/FlashGrab) for the instructions to build from source. This branch isn't ready for building yet.
However, you can still use the same methods as building any other React Native project if you wanna try this out.

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
