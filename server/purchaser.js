const { By, until } = require("selenium-webdriver")
var CryptoJS = require("crypto-js")

function decrypt(cipher) {
    try {
        var bytes = CryptoJS.AES.decrypt(cipher, process.env.KEYS)
        return bytes.toString(CryptoJS.enc.Utf8)
    } catch {
        return cipher
    }
}

class Flipkart {
    constructor(driver, data, socket) {
        this.driver = driver
        this.data = data
        this.socket = socket
    }
    async sequence() {
        await this.login()
        await this.pin_code()
        await this.click_button()
    }
    async login() {
        try {

            // log in
            this.socket.send(`Logging into your Flipkart account`)
            await this.driver.findElement(By.xpath("//a[text()='Login']")).click()
            const actions = this.driver.actions()
            await actions.sendKeys('321vishalds@gmail.com').perform()
            await this.driver.findElement(By.xpath("//input[@type='password']")).sendKeys('nandhu2034@motog6')
            await this.driver.findElement(By.className("_2KpZ6l _2HKlqd _3AWRsL")).click()

            //wait for 2 secs and verify login
            await this.driver.sleep(2000)
            try {
                var source = await this.driver.findElement(By.className('_2YULOR')).getAttribute("innerHTML")
            } catch {
                var source = await this.driver.findElement(By.tagName('html')).getAttribute("innerHTML")
            }
            if (source.includes("username or password is incorrect") || source.includes("enter valid Email ID")) {
                this.socket.send(`Incorrect username or password`)
                throw "Abort"
            } else {
                this.socket.send(`Logged in successfully`)
            }

        } catch {
            this.socket.send(`Sorry. There was an error in logging in...`)
            throw "Abort"
        }
    }
    async pin_code() {
        try {
            await this.driver.findElement(By.xpath("//input[@placeholder='Enter Delivery Pincode']")).sendKeys('695035')
            try {
                await this.driver.findElement(By.xpath("//span[text()='Check']")).click()
            } catch {
                await this.driver.findElement(By.xpath("//span[text()='Change']")).click()
            }
        } catch { throw "Abort" }
    }
    async click_button() {
        try {
            this.socket.send(`Waiting for the BUY NOW button`)
            await this.driver.wait(until.elementLocated(By.xpath("//span[@class='_3iRXzi']")), 60000 * 30)
            await this.driver.findElement(By.xpath("//span[@class='_3iRXzi']")).click()
            this.socket.send(`Clicked BUY NOW button`)
            await this.driver.wait(until.elementLocated(By.xpath("//button[text()='CONTINUE']")), 5000)
        } catch {
            this.socket.send(`Couldn't find BUY NOW button`)
            this.socket.send(`Maybe you're too early. Try again`)
            throw "Abort"
        }
        try {
            await this.driver.findElement(By.xpath("//button[text()='CONTINUE']")).click()
        } catch {
            this.socket.send(`Sorry, couldn't find the CONTINUE button`)
            throw "Abort"
        }
    }
    async cod() {
        try {
            this.socket.send(`Selecting COD as payment method`)
            await this.driver.findElement(By.xpath("//label[@for='COD']")).click()
        } catch { }
    }
    async upi() {
        try {
            this.socket.send(`Paying with your UPI ID`)
            this.driver.sleep(3000)
            await this.driver.wait(until.elementLocated(By.xpath("//label[@for='UPI']"), 5000))
            await this.driver.findElement(By.xpath("//label[@for='UPI']")).click()
            await this.driver.wait(until.elementLocated(By.xpath("//label[@for='UPI_COLLECT']"), 5000))
            await this.driver.findElement(By.xpath("//label[@for='UPI_COLLECT']")).click()
            await this.driver.findElement(By.xpath("//input[@name='upi-id']")).sendKeys(this.data.payment_data)
            await this.driver.findElement(By.xpath("//div[text()='Verify']")).click()
            try {
                await this.driver.findElement(By.xpath("//button[@type='button']")).click()
                this.socket.send(`Please approve payment from your UPI app`)
                this.socket.send(`We'll wait here for you`)
                await this.driver.sleep(6 * 60000)
            } catch {
                this.socket.send(`Couldn't pay with this UPI ID`)
                throw "Abort"
            }
            try {
                await this.driver.findElement(By.xpath("//button[text()='Retry']")).click()
                this.socket.send(`There was a problem with the payment`)
                this.socket.send(`Retrying`)
                this.upi()
            } catch { }
        } catch {
            this.socket.send(`There was a problem with the payment`) 
            throw "Abort" 
        }
    }
}

class Purchaser {
    constructor(driver, data, socket) {
        this.driver = driver
        this.data = data
        this.socket = socket
        this.sellers = {
            "Amazon": '',
            "Flipkart": new Flipkart(this.driver, this.data, this.socket)
        }
    }
    async purchaser() {
        await this.driver.get(this.data.url)
        await this.sellers[this.data.seller].sequence()
        switch (this.data.payment_method) {
            case "COD":
                await this.sellers[this.data.seller].cod()
            case "UPI":
                await this.sellers[this.data.seller].upi()
        }
    }
    async intermediate(otp) {
        console.log(`Logging from intermediate handler: ${otp}`)
    }
}

module.exports = Purchaser