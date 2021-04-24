var DomParser = require('dom-parser');
var parser = new DomParser()

function cleanup_title(text, special_characters) {
    var title = text
    special_characters.forEach(element => {
        while (title.includes(element.special_character)) {
            title = title.replace(element.special_character, element.replace_with)
        }

    })
    return title
}

class Amazon {
    constructor(source) {
        this.source = source
    }
    parse() {
        var dom = parser.parseFromString(this.source)
        try {
            return [cleanup_title(dom.getElementById("title").innerHTML, [{ "special_character": '\n', "replace_with": '' }]), cleanup_title(dom.getElementsByClassName("buyingPrice")[0].innerHTML, [{ "special_character": '\n', "replace_with": '' }]), dom.getElementsByTagName("img")[2].getAttribute("src")]
        } catch {
            var img = parser.parseFromString(dom.getElementsByClassName("imgTagWrapper")[0].innerHTML)
            img = img.getElementsByTagName("img")[0].getAttribute("src")
            var price = parser.parseFromString(dom.getElementsByTagName("td")[3].innerHTML)
            price = price.getElementsByTagName("span")[0].innerHTML
            return [cleanup_title(dom.getElementById("productTitle").innerHTML, [{ "special_character": '\n', "replace_with": '' }]), img, price]
        }
    }
}

class Flipkart {
    constructor(source) {
        this.source = source
    }
    parse() {
        var dom = parser.parseFromString(this.source)
        try {
            return [dom.getElementsByTagName("span")[0].innerHTML, cleanup_title(dom.getElementsByClassName("css-901oao r-cqee49 r-1vgyyaa r-1x35g6 r-1rsjblm")[0].innerHTML, [{"special_character": '₹', "replace_with": ''}, {"special_character": '&nbsp;', "replace_with": ''}]), dom.getElementsByTagName("img")[0].getAttribute("src")]
        } catch { }
    }
}


export default class Parser {
    constructor(source) {
        this.source = source
        this.map = {
            "Amazon": new Amazon(this.source),
            "Flipkart": new Flipkart(this.source)
        }
    }
    data(seller) {
        return this.map[seller].parse()
    }
}
