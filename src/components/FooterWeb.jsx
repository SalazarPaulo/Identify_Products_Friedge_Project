import React from 'react';
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { styles } from '../styles';
import { social_media } from '../constants';
import { fadeIn, textVariant } from "../utils/motion";

const SocialMediaCard = ({
  index,
  title,
  icon,
  social_link,
}) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}
      className='w-[50px] h-[50px] min-w-[50px] cursor-pointer'>
      <a
        href={social_link}  // Cambiar de "to" a "href"
        target="_blank"  // Abrir en una nueva ventana
        rel="noopener noreferrer" // Agregar rel para seguridad
        className="flex items-center gap-2"
      >
        <Tilt
          options={{
            max: 45,
            scale: 1,
            speed: 450,
          }}
        >
          <div className='relative'>
            {/* colocar image */}
            <img
              src={icon}
              alt={title}
              className='w-full h-full object-cover rounded-2xl'
            />
          </div>
        </Tilt>
      </a>
    </motion.div>
  );
}

const FooterWeb = () => {

  return (
    <nav
      className={`${styles.paddingX} w-full flex items-center justify-between 
                  py-5 bottom-0 bg-primary sm:flex`}>

      <div className="w-full flex justify-between items-center max-w-7xl mx-auto sm:flex">
        {/* insertando logo */}
        <motion.div variants={textVariant()}>
          <p className='text-xs/[10px] sm:text-sm' >Copyright@<span className='text-xs/[10px] sm:block'>reserved
          </span> </p>
        </motion.div>

        {/* add a wrapper for a project cards */}
        <div className='flex-row gap-2 flex relative sm:flex sm:gap-10'>
          {social_media.map((social, index) => (
            <SocialMediaCard key={`social-${index}`} index={index} {...social} />
          ))}
        </div>
      </div>
    </nav>
  )
}

export default FooterWeb