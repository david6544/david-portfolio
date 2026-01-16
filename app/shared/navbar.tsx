import { useStoreHook } from "../page"
import styles from "../styles/navbar.module.scss"

export default function Navbar() {

    const setView = useStoreHook((state) => state.updateCurrentView);
    const currentView = useStoreHook().currentView;

return <div className={styles.buttonCol}>
          {currentView != "Home" && <div className={styles.homeButton}
               onClick={() => setView("Home")}
               >
                <p>home</p>
          </div>}
          {currentView != "About" && <div  className={styles.homeButton}
                onClick={() => setView("About")}
                >
                  <p>about_me</p>
          </div>}
          {currentView != "Projects" && <div className={styles.homeButton} 
              onClick={() => setView("Projects")}
              >
                <p>projects</p>
          </div>}
          {currentView != "Blog" && <div className={styles.homeButton} 
              onClick={() => setView("Blog")}
              >
                <p>blog</p>
          </div>}
    </div>
}