from copy import Error
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import websockets, asyncio, json, time

global wbsocket, driver
# Known issues now
# No messages will be sent to phone after "Trying method of Login" for Flipkart

# error thrown when something goes wrong and sale is gonna abort
class Abort(Error):
    pass

# function to send messages to the client
async def status(message):
    try:
        await asyncio.wait([wbsocket.send(message)])
    except:
        raise Abort

# function for submitting OTP. Common for both sellers.
def otp_submit(seller, OTP):
    repeat = True
    if(seller == "Flipkart"):
        try:
            otp = driver.find_element_by_tag_name("input")
            otp.clear()
            otp.send_keys(OTP)
            try:
                # try for flipkart's native OTP window first
                submit_otp = driver.find_element_by_xpath("//button[@type='submit']")
            except:
                try:
                    submit_otp = driver.find_element_by_xpath('//button[text()="Make Payment"]')
                except:
                    try:
                        submit_otp = driver.find_element_by_xpath('//button[text()="Verify"]')
                    except:
                        submit_otp = driver.find_element_by_xpath('//button[text()="Submit"]')
            submit_otp.click()
            time.sleep(8)
        except:
            if repeat:
                repeat = False
                otp_submit(seller, OTP)
            pass
    else:
        try:
            otp = driver.find_element_by_id("otp_name")
            otp.clear()
            otp.send_keys(OTP)
            driver.find_element_by_id("confirmOTPButton").click()
            time.sleep(15)
        except:
            if repeat:
                repeat = False
                otp_submit(seller, OTP)

# Flipkart functions
class Flipkart:

    def __init__(item, username, password, cvv, pin):
        item.username = username
        item.password = password
        item.cvv = cvv
        item.pin = pin

    async def purchase(item):
        await Flipkart.login(item)
        await Flipkart.buy(item, True)
        await Flipkart.order_summary(True)
        await Flipkart.payment(item, True)

    async def login(item):
        #global driver
        try:
            WebDriverWait(driver, 20).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "._1_3w1N"))
            ).click()
            if 'Enter Password' in driver.page_source:
                await status('Trying usual method of login')
                passd = driver.find_element_by_xpath('//input[@type="password"]')
                # there is no way I can make Selenium recognise this username field :(
                # but, there is an auto focus implemented by Flipkart themselves. So, the page will automatically focus on the field
                # we'll simply send the username to nowhere, and it'll automatically go to the focused username field ;)
                actions = ActionChains(driver)
                actions.send_keys(item.username)
                actions.perform()
                passd.clear()
                passd.send_keys(item.password)
                try:
                    buttons = driver.find_elements_by_xpath("//span[contains(text(),'Login')]")
                    for btn in buttons:
                        btn.click()
                    await status('Login button is active')
                except:
                    await status('Login button is inactive')
                time.sleep(2)
                if('Login' in driver.page_source):
                    await status('Incorrect account details')
                    raise Abort
                else:
                    await status('Logged In')
                    return
            else:
                await status('Trying an alternate method for login')
                email = driver.find_element_by_css_selector("._2zrpKA")
                email.clear()
                email.send_keys(item.username)
                WebDriverWait(driver, 5).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, "._1LctnI"))
                ).click()
                WebDriverWait(driver, 5).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, ".jUwFiZ"))
                ).click()
                time.sleep(0.5)
                passd = driver.find_elements_by_css_selector("._2zrpKA")[1]
                passd.clear()
                passd.send_keys(item.password)
                WebDriverWait(driver, 20).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, "._1LctnI"))
                ).click()
                time.sleep(2)
                if('Login' in driver.page_source):
                    await status('Incorrect account details')
                    raise Abort
                else:
                    await status('Logged In')
        except:
            await status('Error in logging in.')
            time.sleep(1)
            raise Abort

    async def buy(item, repeat):
        try:
            nobuyoption = True
            while nobuyoption:
                try:
                    driver.find_element_by_id("pincodeInputId").send_keys(item.pin)
                    driver.find_element_by_xpath("//*[contains(text(), 'Check')]").click()
                    await status('Trying Your PIN code')
                    time.sleep(2)
                    buyprod = driver.find_element_by_xpath("//span[@class='_3iRXzi']")
                    await status('Sale has started')
                    nobuyoption = False
                except:
                    nobuyoption = True
                    await status('Waiting for sale to start')
                    driver.refresh()
                    time.sleep(2)
                    await Flipkart.buy(item, True)
            buyprod.click()
            await status('Clicked BUY NOW button')
            await Flipkart.buy_recheck(True)
            return
        except:
            if repeat:
                await status("Error. Retrying")
                await Flipkart.buy(item, False)
            await status("Most likely, no seller ships to your saved PIN code.")
            time.sleep(3)
            raise Abort

    async def buy_recheck(repeat):
        try:
            WebDriverWait(driver, 4).until(
                EC.title_contains("Secure Payment")
            )
            await status('Redirecting to payment')
        except:
            if repeat:
                await status("Unknown error. Retrying...")
                await Flipkart.buy_recheck(True)
            await status('Error in redirecting to payment')
            time.sleep(2)
            await status('Most likely, no seller ships to your saved address')
            time.sleep(3)
            raise Abort
    
    async def order_summary(repeat):
        await status('Reached ORDER SUMMARY section')
        try:
            press_continue = driver.find_element_by_xpath('//button[contains(text(), "CONTINUE")]')
            press_continue.click()
            await status('Clicked CONTINUE button')
        except:
            if repeat:
                await status("Error. Retrying...")
                await Flipkart.order_summary(False)
            await status('Seems like you have more than one saved address')
            time.sleep(5)
            raise Abort

    async def payment(item, repeat):
        try:
            time.sleep(3)
            # yeah same "logic" as username LOL
            # refer to line 91 for more info
            actions = ActionChains(driver)
            actions.send_keys(item.cvv)
            actions.perform()
            await status('Entered your CVV')
            await Flipkart.payment_continue(True)
        except:
            if repeat:
                await status("Unknown error. Retrying...")
                await Flipkart.payment(item, False)
            await status('You might have more than one saved cards')
            time.sleep(5)
            raise Abort

    async def payment_continue(repeat):
        try:
            driver.find_element_by_xpath('//button[contains(text(), "Continue")]').click()
            await status('Redirecting to enter OTP. Be ready!')
        except:
            if repeat:
                await status("Error. Retrying...")
                await Flipkart.payment_continue(False)
            await status('CONTINUE button is inactive')
            time.sleep(5)
            raise Abort

# Amazon function
class Amazon:

    def __init__(item, url, username, password, cvv, pin):
        item.url = url
        item.username = username
        item.password = password
        item.cvv = cvv
        item.pin = pin

    async def purchase(item):
        await Amazon.login(item, True)
        await Amazon.buy(True)
        await Amazon.payment(item, True)
        await Amazon.prime(True)
        await Amazon.payment_continue()
        await Amazon.duplicate()

    async def login(item, repeat):
        await status('Trying to login')
        try:
            driver.find_element_by_id("nav-link-accountList").click()
            await status('Clicked login button')
            driver.find_element_by_id("ap_email").send_keys(item.username)
            driver.find_element_by_id("continue").click()
            time.sleep(1)
            if 'There was a problem' in driver.page_source:
                await status('Incorrect email address')
                time.sleep(3)
                raise Abort
            await status('Entered username')
            driver.find_element_by_id("ap_password").send_keys(item.password)
            driver.find_element_by_id("signInSubmit").click()
            time.sleep(1)
            if 'Your password is incorrect' in driver.page_source:
                await status('Incorrect password')
                time.sleep(3)
                raise Abort (True)
            await status('Entered password')
            time.sleep(2)
            if driver.title == "Two-Step Verification":
                await status('2 step verification is active for this account')
                time.sleep(3)
                raise Abort
            else:
                await status('Logged in successfully')
        except:
            if repeat:
                await Amazon.login(False)
            await status('Unknown error in login')
            time.sleep(2)
            raise Abort

    async def buy(repeat):
        try:
            try:
                driver.find_element_by_id("buy-now-button").click()
                await status('Clicked Buy Now button')
            except:
                if 'Currently unavailable.' in driver.page_source:
                    await status('Waiting for sale to start')
                    driver.refresh()
                    time.sleep(2)
                    await Amazon.buy(True)
        except:
            if repeat:
                await status("Error. Retrying")
                await Amazon.buy(False)
            await status('An unknown error occured')
            raise Abort

    async def payment(item, repeat):
        try:
            await status('Entering CVV for your card')
            driver.find_element_by_xpath('//input[@name="addCreditCardVerificationNumber0"]').send_keys(item.cvv)
            driver.find_element_by_xpath('//input[@name="ppw-widgetEvent:SetPaymentPlanSelectContinueEvent"]').click()
            # amazon takes around 10 seconds to get to the payment confirmation/Amazon Prime screen
            time.sleep(10)
            await status('Redirecting to enter OTP')
        except:
            if "Some items in your order are not deliverable to the selected address." in driver.page_source:
                await status("Seller doesn't ship to your address")
                time.sleep(5)
                raise Abort(item, True)
            if repeat:
                await status('Retrying')
                await Amazon.payment(item, False)
            else:
                await status('You might have more than one saved cards')
                time.sleep(5)
                raise Abort

    async def prime(repeat):
        try:
            if "Get FREE fast delivery on eligible items in this order" in driver.page_source:
                await status('Avoiding Amazon Prime page')
                driver.find_element_by_id(
                    "prime-interstitial-nothanks-button").click()
                await status('Said "No Thanks" to Amazon Prime')
                time.sleep(2)
                await status('Redirecting to enter OTP! Get ready')
            else:
                await status('Please wait...')
        except:
            if repeat:
                await status('Retrying')
                await Amazon.prime(False)
            await status('An unknown error occured')
            time.sleep(5)
            raise Abort
    
    async def payment_continue():
        try:
            driver.find_element_by_xpath('//input[@name="placeYourOrder1"]').click()
        except:
            await status('No Place Order button')
            raise Abort

    async def duplicate():
        try:
            if "This is a duplicate order" in driver.page_source:
                await status('This is a duplicate order')
                time.sleep(3)
                driver.find_element_by_xpath('//input[@name="forcePlaceOrder"]').click()
                await status("Placed this duplicate order")
            else:
                pass
        except:
            await status("An unknown error occured")
            raise Abort

# main funtion that accepts messages from client via websocket connection
async def recieve_messages(websocket, path):
    global wbsocket, driver
    wbsocket = websocket
    try:
        await status("Connected to server")
        try:
            details = await wbsocket.recv()
            data = json.loads(details)
        except:
            raise Abort
        driver = webdriver.Chrome('./chromedriver')
        driver.maximize_window()
        await status("Opening your link using Google Chrome in server")
        driver.get(data["url"])
        if data["seller"] == "Flipkart":
            site = Flipkart(data["username"], data["password"], data["cvv"], data["pin"])
        else:
            site = Amazon(data["url"], data["username"], data["password"], data["cvv"], data["pin"])
        await site.purchase()
        await status('OTP')
        try:
            details = await websocket.recv()
            #after this, no websocket statements will work
            data = json.loads(details)
        except:
            raise Abort
        otp_submit(data["seller"], data["otp"])
    except Abort:
        await wbsocket.send("Sorry. Purchase has failed.")
    driver.close()
    await wbsocket.close(1000)

start_server = websockets.serve(recieve_messages, "localhost", 5000)
asyncio.get_event_loop().run_until_complete(start_server)

try:
    print("Server is running")
    asyncio.get_event_loop().run_forever()
except KeyboardInterrupt:
    print("Server is stopping")