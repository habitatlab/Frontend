import PropTypes from 'prop-types'
import React, { useEffect } from "react"

// MetisMenu
import MetisMenu from "metismenujs"
import { withRouter } from "react-router-dom"
import { Link } from "react-router-dom"

//i18n
import { withTranslation } from "react-i18next"

const SidebarContent = props => {
  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    const pathName = props.location.pathname

    const initMenu = () => {
      new MetisMenu("#side-menu")
      let matchingMenuItem = null
      const ul = document.getElementById("side-menu")
      const items = ul.getElementsByTagName("a")
      for (let i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i]
          break
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem)
      }
    }
    initMenu()
  }, [props.location.pathname])

  function activateParentDropdown(item) {
    item.classList.add("active")
    const parent = item.parentElement

    if (parent) {
      parent.classList.add("mm-active")
      const parent2 = parent.parentElement

      if (parent2) {
        parent2.classList.add("mm-show")

        const parent3 = parent2.parentElement

        if (parent3) {
          parent3.classList.add("mm-active") // li
          parent3.childNodes[0].classList.add("mm-active") //a
          const parent4 = parent3.parentElement
          if (parent4) {
            parent4.classList.add("mm-active")
          }
        }
      }
      return false
    }
    return false
  }

  return (
    <React.Fragment>
      <div id="sidebar-menu">
        <ul className="metismenu list-unstyled" id="side-menu">
          <li className="menu-title">{props.t("Menu")} </li>
	  
         <li>
	    <Link to="/daily-log" className=" waves-effect">
	       <i className="mdi mdi-medical-bag"></i>
	       <span>{props.t("Animal Health")}</span>
	    </Link>
	  </li>

	  <li>
	    <Link to="/burrow-control" className="waves-effect">
	      <i className="mdi mdi-camera-control"></i>
	      <span>{props.t("Burrow Control")}</span>
	    </Link>
	  </li>

	  <li>
	    <Link to="/occupancy" className=" waves-effect">
	      <i className="bx bx-calendar"></i>
	      <span>{props.t("Cage Occupancy")}</span>
	    </Link>
	  </li>
 <li>
            <Link to="/dataquery" className=" waves-effect">
              <i className="bx bx-search-alt-2"></i>
              <span>{props.t("Data Query")}</span>
            </Link>
          </li>
	   <li>
            <Link to="/videostreamer" className=" waves-effect">
              <i className="bx bx-search-alt-2"></i>
              <span>{props.t("Video Streamer")}</span>
            </Link>
          </li>



        </ul>
      </div>
    </React.Fragment>
  )
}

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any
}

export default withRouter(withTranslation()(SidebarContent))
