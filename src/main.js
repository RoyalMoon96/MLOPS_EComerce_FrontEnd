import { navbar } from "./components/navbar.js"
import { footer } from "./components/footer.js"
import { router } from "./router/router.js"
import {updateCartBadge} from "./utils/updateCartBadge.js"

document.getElementById("navbar").innerHTML = navbar()
document.getElementById("footer").innerHTML = footer()
window.addEventListener("load", () => {
    updateCartBadge()
})

window.addEventListener("hashchange", router)

window.addEventListener("load", router)

if (!window.location.hash) {
    window.location.hash = "#catalog"
}