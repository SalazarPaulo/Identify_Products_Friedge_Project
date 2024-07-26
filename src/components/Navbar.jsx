import { useEffect, useState } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { styles } from '../styles';
import { navLinks } from '../constants';
import { logo, menu, close } from '../assets';

// BARRA DE NAVEGACION, ESTA EL LOGO, ABOUT, ETC
const Navbar = () => {
  const [active, setActive] = useState('');
  const [toggle, setToggle] = useState(false);

  return (
    <nav
      className={`${styles.paddingX} w-full flex items-center justify-between 
                  py-5 fixed top-0 z-20 bg-cuartiary`}>
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => {
            setActive('');
            window.scrollTo(0, 0);
          }}
        >
          {/* insertando logo */}
          <img src={logo} alt="logo" className="w-9 h-9 object-contain" />
          {/* Titulo debajo del logo */}
          <p className="text-white text-[18px] font-bold cursor-pointer flex">
            Computer Networks &nbsp;
            <span className="sm:block hidden">Project</span>
          </p>
          {/* Hasta aqui Se obtiene el Navbar */}
        </Link>
        {/* Acomodar en horizontal logo y menu */}
        <ul className="list-none hidden flex-row gap-10 lg:flex">
          {navLinks.map((link) => (
            <li
              key={link.id}
              // para que se iluminen los links
              className={`${
                active === link.title ? 'text-secondary font-medium' : 'text-white '
              } hover:font-bold hover:text-secondary font-bold text-[18px]  cursor-pointer lg:text-[14px] xl:text-[18px]`}
              // active de link title
              onClick={() => setActive(link.title)}
            >
              <a href={`#${link.id}`}>{link.title}</a>
            </li>
          ))}
        </ul>

        {/* mobile navigation */}
        {/* Setear el icono del menu en la esquina izquierda */}
        <div className="flex flex-1 justify-end items-center md:flex lg:hidden">
          <img
            src={toggle ? close : menu}
            alt="menu"
            className="w-[28px] h-[28px] object-contain cursor-pointer"
            onClick={() => setToggle(!toggle)}
          />
          <div
            className={`${
              !toggle ? 'hidden' : 'flex'
            } p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}
          >
            <ul className="list-none flex justify-end items-start flex-col gap-4">
              {navLinks.map((link) => (
                <li
                  key={link.id}
                  // para que se iluminen los links
                  className={`${
                    active === link.title ? 'text-white font-bold' : 'text-secondary'
                  } font-poppins font-medium cursor-pointer text-[16px]`}
                  // active de link title
                  onClick={() => {
                    setToggle(!toggle);
                    setActive(link.title);
                  }}
                >
                  <a href={`#${link.id}`}>{link.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
