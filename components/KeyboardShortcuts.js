import { useContext } from "react"
import { useRouter } from "next/router"
import useMousetrap from "mousetrap-react"

import { AppContext } from "@/components/ContextProvider"
import { setToStorage } from "@/lib/localStorage"

const mouseClickEvents = ["click"]

function simulateMouseClick(element) {
  mouseClickEvents.forEach((mouseEventType) =>
    element.dispatchEvent(
      new MouseEvent(mouseEventType, {
        view: window,
        bubbles: true,
        cancelable: true,
        buttons: 1,
      })
    )
  )
}

function clientEventLogger(pathname, data) {
  const url = `https://us-central1-johnmathews-website.cloudfunctions.net/client-event-logger?path=${pathname}`
  window.navigator.sendBeacon(url, data)
}

const KeyboardShortcuts = () => {
  const router = useRouter()
  const [state, dispatch] = useContext(AppContext)

  function TOGGLE_MODAL() {
    dispatch({
      type: "MODAL",
    })
  }
  function HIDE_MODAL() {
    if (state.showModal) {
      dispatch({
        type: "HIDE_MODAL",
      })
    }
  }

  // https://www.anycodings.com/1questions/5494275/focusing-input-field-with-mousetrapjs-but-input-field-also-pastes-the-hotkey-as-value
  useMousetrap(["/", "command+k"], (e) => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "cmd+k" })
    clientEventLogger(router.asPath, data)
    e.preventDefault()

    let searchBox = document.querySelector(".aa-DetachedSearchButtonPlaceholder")
    let overlay = document.querySelector(".aa-DetachedCancelButton")

    if (overlay) {
      simulateMouseClick(overlay)
      e.preventDefault()
    } else {
      simulateMouseClick(searchBox)
      searchBox.focus()
      e.preventDefault()
    }
  })

  useMousetrap(["tab"], () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "tab" })
    clientEventLogger(router.asPath, data)
    dispatch({ type: "TOGGLE_KEYBOARD_HINTS" })
  })

  useMousetrap(["j"], () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "j" })
    clientEventLogger(router.asPath, data)
    window.scrollBy({ top: 200, left: 0, behavior: "smooth" })
    HIDE_MODAL()
  })

  useMousetrap(["k"], () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "k" })
    clientEventLogger(router.asPath, data)
    window.scrollBy({ top: -200, left: 0, behavior: "smooth" })
    HIDE_MODAL()
  })

  useMousetrap("ctrl+j", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "ctrl+j" })
    clientEventLogger(router.asPath, data)
    // this keyboard_mode_on needs to exist, and be before the "selected"
    // element is getted, because if keyboard mode is off (normal mode) then
    // selection boxes arent visible because the page looks normal
    dispatch({ type: "KEYBOARD_MODE_ON" })
    const element = document.getElementsByClassName("selected")
    if (element[0] != undefined) {
      dispatch({ type: "LIST_POSITION_INCREASE" }) // this changes the index and therefore changes what element has "selected" status
      try {
        element[0].scrollIntoView({ behavior: "smooth", block: "end" })
      } catch {
        dispatch({ type: "LIST_POSITION_RESET" })
      }
    } else {
      // https://stackoverflow.com/questions/596481/is-it-possible-to-simulate-key-press-events-programmatically
    }
  })

  useMousetrap("ctrl+k", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "ctrl+j" })
    clientEventLogger(router.asPath, data)
    // this keyboard_mode_on needs to exist, and be before the "selected"
    // element is getted, because if keyboard mode is off (normal mode) then
    // selection boxes arent visible because the page looks normal
    dispatch({ type: "KEYBOARD_MODE_ON" })
    const element = document.getElementsByClassName("selected")
    if (element.length > 0) {
      dispatch({ type: "LIST_POSITION_DECREASE" })
      element[0].scrollIntoView({ behavior: "smooth", block: "end" })
    } else {
      // https://stackoverflow.com/questions/596481/is-it-possible-to-simulate-key-press-events-programmatically
    }
  })

  useMousetrap("return", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "return" })
    clientEventLogger(router.asPath, data)
    let selectedPost = document.querySelector(".viewable .selected")
    dispatch({ type: "LIST_POSITION_RESET" })
    simulateMouseClick(selectedPost)
    HIDE_MODAL()
  })

  useMousetrap(["?", "esc", "q"], () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "?" })
    clientEventLogger(router.asPath, data)
    TOGGLE_MODAL()
  })

  useMousetrap("n p", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "np" })
    clientEventLogger(router.asPath, data)
    let nextPostButton = document.querySelector("#nextPost")
    simulateMouseClick(nextPostButton)
    HIDE_MODAL()
    dispatch({ type: "LIST_POSITION_RESET" })
  })
  useMousetrap("p p", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "pp" })
    clientEventLogger(router.asPath, data)
    let prevPostButton = document.querySelector("#previousPost")
    simulateMouseClick(prevPostButton)
    HIDE_MODAL()
    dispatch({ type: "LIST_POSITION_RESET" })
  })

  useMousetrap("v a", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "va" })
    clientEventLogger(router.asPath, data)
    setToStorage("postFilter", "both")
    let allPostsButton = document.querySelector("#selectAllPosts")
    simulateMouseClick(allPostsButton)
    dispatch({ type: "LIST_POSITION_RESET" })
    window.scrollTo(0, 0)
    HIDE_MODAL()
  })
  useMousetrap("v n", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "vn" })
    clientEventLogger(router.asPath, data)
    let nonTechnicalButton = document.querySelector("#selectNonTechnical")
    setToStorage("postFilter", "nontechnical")
    simulateMouseClick(nonTechnicalButton)
    dispatch({ type: "LIST_POSITION_RESET" })
    window.scrollTo(0, 0)
    HIDE_MODAL()
  })
  useMousetrap("v t", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "vt" })
    clientEventLogger(router.asPath, data)
    let technicalButton = document.querySelector("#selectTechnical")
    setToStorage("postFilter", "technical")
    simulateMouseClick(technicalButton)
    dispatch({ type: "LIST_POSITION_RESET" })
    window.scrollTo(0, 0)
    HIDE_MODAL()
  })

  useMousetrap("t t", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "tt" })
    clientEventLogger(router.asPath, data)
    let themeButton = document.querySelector("#themeSwitcher")
    simulateMouseClick(themeButton)
    HIDE_MODAL()
  })

  useMousetrap("g g", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "gg" })
    clientEventLogger(router.asPath, data)
    window.scrollTo(0, 0)
    dispatch({ type: "LIST_POSITION_RESET" })
    HIDE_MODAL()
  })

  useMousetrap("G", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "G" })
    clientEventLogger(router.asPath, data)
    window.scrollTo(0, 999999)
    HIDE_MODAL()
  })

  useMousetrap("b f", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "gf" })
    clientEventLogger(router.asPath, data)
    window.history.forward()
    HIDE_MODAL()
    dispatch({ type: "LIST_POSITION_RESET" })
  })
  useMousetrap("b b", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "gb" })
    clientEventLogger(router.asPath, data)
    window.history.back()
    HIDE_MODAL()
    dispatch({ type: "LIST_POSITION_RESET" })
  })

  useMousetrap("c a", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "ca" })
    clientEventLogger(router.asPath, data)
    router.push("/categories")
    HIDE_MODAL()
    dispatch({ type: "LIST_POSITION_RESET" })
  })
  useMousetrap("c b", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "cb" })
    clientEventLogger(router.asPath, data)
    router.push("/bible")
    HIDE_MODAL()
    dispatch({ type: "LIST_POSITION_RESET" })
  })
  useMousetrap("c e", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "ce" })
    clientEventLogger(router.asPath, data)
    router.push("/engineering")
    HIDE_MODAL()
    dispatch({ type: "LIST_POSITION_RESET" })
  })
  useMousetrap("c f", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "cf" })
    clientEventLogger(router.asPath, data)
    router.push("/finance")
    HIDE_MODAL()
    dispatch({ type: "LIST_POSITION_RESET" })
  })
  useMousetrap("c m", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "cm" })
    clientEventLogger(router.asPath, data)
    router.push("/micro-saas")
    HIDE_MODAL()
    dispatch({ type: "LIST_POSITION_RESET" })
  })
  useMousetrap("c n", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "cn" })
    clientEventLogger(router.asPath, data)
    router.push("/math")
    HIDE_MODAL()
    dispatch({ type: "LIST_POSITION_RESET" })
  })
  useMousetrap("c k", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "ck" })
    clientEventLogger(router.asPath, data)
    router.push("/books")
    HIDE_MODAL()
    dispatch({ type: "LIST_POSITION_RESET" })
  })
  useMousetrap("c l", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "cl" })
    clientEventLogger(router.asPath, data)
    router.push("/longform")
    HIDE_MODAL()
    dispatch({ type: "LIST_POSITION_RESET" })
  })
  useMousetrap("c p", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "cp" })
    clientEventLogger(router.asPath, data)
    router.push("/sport")
    HIDE_MODAL()
    dispatch({ type: "LIST_POSITION_RESET" })
  })
  useMousetrap("c s", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "cs" })
    clientEventLogger(router.asPath, data)
    router.push("/summaries")
    HIDE_MODAL()
    dispatch({ type: "LIST_POSITION_RESET" })
  })
  useMousetrap("c t", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "ct" })
    clientEventLogger(router.asPath, data)
    router.push("/meta")
    HIDE_MODAL()
    dispatch({ type: "LIST_POSITION_RESET" })
  })

  useMousetrap("g a", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "ga" })
    clientEventLogger(router.asPath, data)
    router.push("/about")
    HIDE_MODAL()
    dispatch({ type: "LIST_POSITION_RESET" })
  })
  useMousetrap("g c", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "gc" })
    clientEventLogger(router.asPath, data)
    router.push("/collections")
    HIDE_MODAL()
    dispatch({ type: "LIST_POSITION_RESET" })
  })
  useMousetrap("g e", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "ge" })
    clientEventLogger(router.asPath, data)
    router.push("/experience")
    HIDE_MODAL()
    dispatch({ type: "LIST_POSITION_RESET" })
  })
  useMousetrap("g i", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "gi" })
    clientEventLogger(router.asPath, data)
    router.push("/posts")
    HIDE_MODAL()
    dispatch({ type: "LIST_POSITION_RESET" })
  })
  useMousetrap("g j", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "gp" })
    clientEventLogger(router.asPath, data)
    router.push("/projects")
    HIDE_MODAL()
    dispatch({ type: "LIST_POSITION_RESET" })
  })
  useMousetrap("g l", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "gl" })
    clientEventLogger(router.asPath, data)
    router.push("/")
    HIDE_MODAL()
    dispatch({ type: "LIST_POSITION_RESET" })
  })
  useMousetrap("g m", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "gm" })
    clientEventLogger(router.asPath, data)
    router.push("/metrics")
    HIDE_MODAL()
    dispatch({ type: "LIST_POSITION_RESET" })
  })
  useMousetrap("g p", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "gp" })
    clientEventLogger(router.asPath, data)
    router.push("/photographs")
    HIDE_MODAL()
    dispatch({ type: "LIST_POSITION_RESET" })
  })
  useMousetrap("g s", () => {
    let data = JSON.stringify({ category: "keyboard-shortcut", event: "gs" })
    clientEventLogger(router.asPath, data)
    router.push("/snippets")
    HIDE_MODAL()
    dispatch({ type: "LIST_POSITION_RESET" })
  })
  return <></>
}

export default KeyboardShortcuts
