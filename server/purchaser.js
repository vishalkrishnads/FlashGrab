class Amazon {
    constructor(driver, data, parent) {
        this.driver = driver
        this.data = data
        this.client = new Client(parent)
    }
    async sequence() {
        await this.login()
    }
    async login() {
        try {
            this.client.message(`Logging in to your account`)
            await this.driver.click("//a[@data-nav-role='signin']")
            await this.driver.fill("//input[@type='email']", this.data.username)
            await this.driver.click("//input[@type='submit']")
            if (await this.driver.waitForSelector("//h4[text()='There was a problem']", { timeout: 2000 })) {
                this.client.message({ "message": `Username is incorrect`, "error": true })
                throw "Abort"
            }
            await this.driver.fill("//input[@type='password']", this.data.password)
            await this.driver.click("//input[@id='signInSubmit']")
            if (await this.driver.waitForSelector("//h4[text()='There was a problem']", { timeout: 2000 }) || await this.driver.waitForSelector("//h4[text()='Important Message!']", { timeout: 2000 })) {
                this.client.message({ "message": `Password might be incorrect`, "error": true })
                throw "Abort"
            }
            this.client.message(`Logged in successfully`)
        } catch { throw "Abort" }
    }
    async click_button() {
        try {
            await this.driver.click("//input[@id='buy-now-button']")
        } catch {
            this.client.message(`Couldn't find Buy Now button. Maybe sale hasn't started yet`)
            this.client.message(`Please try again later`)
            throw "Abort"
        }
    }
    async confirm() {
        try {
            await this.driver.fill("//input[@type='password']", this.data.password)
            await this.driver.click("//input[@id='signInSubmit']")
        } catch { }
    }
    async continue() {
        try {
            // select first one from saved address
            await this.driver.click(`:nth-match(//div[contains(@class, 'ship-to-this-address')], 1)`)
        } catch (e) { console.log(e); throw "Abort" }
    }
    async cod() {
        try {
            await this.driver.click(`:nth-match(//span[text()='Pay on Delivery'], 2)`)
            await this.driver.click("//input[@type='submit']")
            await this.driver.click("//input[@value='Place your order']")
            return false
        } catch (e) {
            console.log(e)
            throw "Abort"
        }
    }
}

class Flipkart {
    constructor(driver, data, parent) {
        this.driver = driver
        this.data = data
        this.Client = new Client(parent)
    }
    async sequence() {
        await this.login()
        await this.pin_code()
        await this.click_button()
    }
    async login() {
        try {

            // log in
            this.Client.message(`Logging into your Flipkart account`)
            await this.driver.click("//a[text()='Login']")
            await this.driver.keyboard.type(this.data.username)
            await this.driver.fill("//input[@type='password']", this.data.password)
            await this.driver.click("//button[@class='_2KpZ6l _2HKlqd _3AWRsL']")

            //verify login
            this.Client.message(`Verifying Login`)
            await this.driver.waitForTimeout(1000)
            try {
                var source = await this.driver.innerHTML("//body")
                if (source.includes(`<span class="_2YULOR"><span>Your username or password is incorrect</span></span>`) || source.includes(`<span class="_2YULOR">`)) {
                    this.Client.message({ "message": `Incorrect username or password`, "error": true })
                    throw "Abort"
                } else { this.Client.message(`Logged in successfully`) }
            } catch (e) { if (e === "Abort") throw "Abort" }
        } catch {
            this.Client.message({ "message": `Sorry. There was an error in logging in...`, "error": true })
            throw "Abort"
        }
    }
    async pin_code() {
        try {
            this.Client.message(`Checking with your PIN code`)
            await this.driver.fill('#pincodeInputId', this.data.pin_code)
            try {
                await this.driver.click("//span[text()='Change']", { timeout: 2000 })
            } catch {
                this.Client.message({ "message": `Problem checking PIN code`, "error": true })
                this.Client.message(`Retrying`)
                await this.driver.click("//span[text()='Check']")
            }
        } catch { throw "Abort" }
    }
    async click_button() {
        try {
            this.Client.message(`Waiting for the BUY NOW button`)
            while (true) {
                try {
                    await this.driver.waitForTimeout(2000)
                    await this.driver.click("//span[@class='_3iRXzi']", { timeout: 2000 })
                    this.Client.message(`Clicked BUY NOW button`)
                    break
                } catch {
                    try {
                        if (await this.driver.waitForSelector("//button[text()='NOTIFY ME']", { timeout: 1000 })) {
                            this.Client.message(`Sale hasn't started yet. Please wait`)
                            this.driver.reload()
                        }
                    } catch {
                        try {
                            console.log("Xpath is: //p[text()='" + this.data.pin_code + "']")
                            await this.driver.click("//input[@placeholder='Enter Delivery Pincode']")
                            await this.driver.click("//p[text()='" + this.data.pin_code + "']", { timeout: 2000 })
                        } catch (e) {
                            console.log(e)
                            try {
                                /*
                                    Why do we have to do all these "unnecessary" tasks now??
                                    Well, turns out Flipkart has some wild bugs and they need to get it through their heads :D
                                    Webdrivers (both Selenium & playwright) sometimes fail to fill out their PIN Code field properly. Dunno if they intentionally did it btw or how they're doing it
                                    Anyway, for them, that's not really a "bug" is it? It's something they prolly like since apps like FlashGrab will have a hard time functioning properly and they'll be fine.
                                    Well then dude, what's that bug? The bug is, if the customer had saved an address and even if they deleted it, Flipkart auto fills it in the PIN code field onload(), sometimes with the deleted PIN code itself LMAO
                                    It turns out if you manually Edit the address, hit the SAVE button and go back, it auto fills with that PIN code, noice.
                                    Now let's make our server do the same thing ;) if he finds that the BUY NOW button isn't clickable, before running off and telling the client "This product doesn't ship to your PIN code"
                                    You know, just to be sure LOL 
                                */
                                await this.Client.message(`Hmm... Sale has started but...`)
                                await this.Client.message(`Maybe this doesn't ship to your PIN Code?`)
                                await this.Client.message(`Re-verifying`)
                                await this.driver.goto('https://www.flipkart.com/account/addresses')
                                await this.driver.hover("//div[@class='dpjmKp']")
                                await this.driver.click("//span[text()='Edit']")
                                await this.driver.click("//button[text()='Save']")
                                await this.driver.waitForTimeout(1000)
                                await this.driver.goBack()
                                await this.driver.reload()
                            } catch { }
                        }
                        try {
                            await this.driver.click("//span[@class='_3iRXzi']", { timeout: 2000 })
                            await this.Client.message(`Clicked BUY NOW button`)
                            break
                        } catch {
                            this.Client.message({ "message": `This product doesn't ship to your PIN code`, "error": true })
                            throw "Abort"
                        }
                    }
                }
            }
        } catch { throw "Abort" }
        try {
            // if the user has saved multiple addresses
            await this.driver.click("//button[text()='Deliver Here']", { timeout: 3000 })
        } catch { }
        try {
            await this.driver.click("//button[text()='CONTINUE']")
        } catch {
            this.Client.message({ "message": `Sorry, couldn't find the CONTINUE button`, "error": true })
            throw "Abort"
        }
    }
    async cod(sequence) {
        if (sequence.intermediate) {
            try {
                await this.driver.fill("//input[@name='captcha']", sequence.intermediate_data)
                await this.driver.click("//span[text()='Confirm Order']")
                this.Client.message(`Checking captcha`)
                await this.driver.waitForTimeout(2000)
                var source = await this.driver.innerHTML("//body")
                if (source.includes("<li>Incorrect text entered. Please try again.</li>")) {
                    this.Client.message({ "message": `Incorrect captcha`, "error": true })
                    this.Client.message(`Sorry. But your purchase has failed.`)
                    this.Client.message(`We don't have enough compute resources to give you a second chance`)
                    this.Client.message(`Please retry the purchase`)
                } else {
                    this.Client.message(`Yay, order placed!!!`)
                    this.Client.message(`Check order details in the Flipkart app/website`)
                }
            } catch (e) {
                console.log(e)
                this.Client.message({ "message": `Problem dealing with captcha`, "error": true })
                throw "Abort"
            }
        }
        else {
            try {
                this.Client.message(`Selecting COD as payment method`)
                await this.driver.click("//label[@for='COD']")
                const value = await this.driver.getAttribute("//img[@class='AVFlbS']", "src")
                this.Client.message({ "intermediate": true, "image": value, "title": `Enter captcha`, "placeholder": `Enter the captcha`, "instruction": `Flipkart requires you to fill this captcha for COD orders` })
                return true
            } catch { }
        }
    }
    async upi() {
        try {
            this.Client.message(`Paying with your UPI ID`)
            await this.driver.click("//label[@for='UPI']")
            await this.driver.click("//label[@for='UPI_COLLECT']")
            // await this.driver.sleep(3000)
            await this.driver.fill("//input[@name='upi-id']", this.data.payment_data)
            await this.driver.click("//div[text()='Verify']")
            try {
                await this.driver.click("//button[@type='button']")
            } catch {
                this.Client.message({ "message": `Couldn't pay with this UPI ID`, "error": true })
                throw "Abort"
            }
            try {
                await this.driver.click("//button[text()='Retry']")
                this.Client.message({ "message": `There was a problem with the payment`, "error": true })
                this.Client.message(`Retrying`)
                this.upi()
            } catch { }
            this.Client.message(`Please approve payment from your UPI app`)
            this.Client.message(`We'll wait here for you`)
            await this.driver.waitForTimeout(6 * 60000)
            return false
        } catch {
            this.Client.message({ "message": `There was a problem with the payment`, "error": true })
            throw "Abort"
        }
    }
    async card(sequence) {
        if (sequence.intermediate) { }
        else {
            await this.driver.fill("//input[@name='cvv']", this.data.payment_data)
            await this.driver.click("//button[text()='Continue']")
            this.Client.message({ "intermediate": true, "image": false, "title": `Enter OTP`, "placeholder": `Enter the OTP`, "instruction": `We need the OTP you received from your bank to complete this purchase` })
        }
    }
}

class Client {
    constructor(parent) { this.parent = parent }
    message(message) {
        if (message.constructor === ({}).constructor) {
            console.log(`
            Message: ${message.message}
            Error status: ${message.error}
            `)
            if (message.error) {
                this.parent.postMessage({ "message": message.message, "error": true })
            } else if (message.intermediate) {
                this.parent.postMessage({ "intermediate": true, "intermediate_data": { "image": message.image, "title": message.title, "placeholder": message.placeholder, "instruction": message.instruction } })
            } else { this.parent.postMessage({ "message": message.message, "error": false }) }
        } else {
            console.log(`
            Message: ${message}
            Error status: false\n
            `)
            this.parent.postMessage({ "message": message, "error": false })
        }
    }
}

class Purchaser {
    constructor(driver, data, parent) {
        this.driver = driver
        this.data = data
        this.parent = parent
        this.sellers = {
            "Amazon": new Amazon(this.driver, this.data, this.parent),
            "Flipkart": new Flipkart(this.driver, this.data, this.parent)
        }
    }
    async purchaser() {
        await this.driver.goto(this.data.url);
        await this.sellers[this.data.seller].sequence()
        var isrecurring = false
        switch (this.data.payment_method) {
            case "COD":
                isrecurring = await this.sellers[this.data.seller].cod({ "intermediate": false })
                break
            case "UPI":
                isrecurring = await this.sellers[this.data.seller].upi()
                break
        }
        return isrecurring
    }
    async intermediate(data) {
        switch (this.data.payment_method) {
            case "COD":
                await this.sellers[this.data.seller].cod(data)
                break
            case "Card":
                await this.sellers[this.data.seller].card(data)
                break
        }
    }
}

module.exports = Purchaser