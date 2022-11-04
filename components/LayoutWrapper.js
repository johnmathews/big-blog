import headerNavLinks from "@/data/headerNavLinks"
import Link from "./Link"
import SectionContainer from "./SectionContainer"
import MobileNav from "./MobileNav"
import ThemeSwitch from "./ThemeSwitch"

import Autocomplete from "@/components/AutoComplete"
import "@algolia/autocomplete-theme-classic"

const LayoutWrapper = ({ children }) => {
  return (
    <SectionContainer className="relative mb-10 mr-5 md:items-center md:justify-between">
      <div
        id="sidebarTopSection-LayoutWrapper"
        className="hidden text-base leading-5 md:fixed md:-ml-24 md:block lg:-ml-12 2xl:mt-5"
      >
        <div className="hidden md:block">
          <div className="-ml-3 mb-3 text-left">
            <ThemeSwitch />
          </div>

          {headerNavLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="my-1 flex py-1 text-left text-lg text-gray-900 hover:underline dark:text-gray-100 md:flex-col 2xl:my-2"
            >
              {link.title}
            </Link>
          ))}

          <div id="autoCompleteComponentWrapper" className="-mt-1">
            <Autocomplete />
          </div>
        </div>
      </div>

      <MobileNav />
      <main id="main-layoutwrapper" className="mx-auto md:ml-12 xl:ml-32 2xl:ml-48">
        {children}
      </main>
    </SectionContainer>
  )
}

export default LayoutWrapper
