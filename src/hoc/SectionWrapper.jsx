import { motion } from "framer-motion";
import { styles } from "../styles";
import { staggerContainer } from "../utils/motion";

// idName para navegar entre las Secciones about, work, etc
// aqui se configura para que toda la pagina tenga un espacio respecto laterales
// y se acomode en el centro
const StarWrapper = (Component, idName) =>
    function HOC() {
      return (
          <motion.section
              // to animate the section
              variants = { staggerContainer() }
              initial = "hidden"
              whileInView = "show"
              viewport={{ once: true, amount:0.25 }}  
              // otorga la animacion horizontal de los cards 
              className={`${styles.padding} max-w-7xl mx-auto relative z-0 `}
          >
            <span className='hash-span' id={idName}>
                &nbsp;
            </span>
              {/* renderizar el componente original */}
              <Component />
          </motion.section>
      )
    };
  
  export default StarWrapper