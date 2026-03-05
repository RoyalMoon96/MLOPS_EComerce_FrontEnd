export function loader() {
  return `
        <div class="d-flex justify-content-center align-items-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
  `
}


/* 
EJEMPLO DE USO:

import { loader } from "../components/loader.js"

export function catalog() {

  const container = document.getElementById("app")

  container.innerHTML = loader()

  setTimeout(() => {
    container.innerHTML = "<h2>Products loaded</h2>"
  }, 2000)

}

*/